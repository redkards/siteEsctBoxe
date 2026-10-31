import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { ArticleService } from './article.service';
import { BoxerService } from './boxer.service';
import { ClubService } from './club.service';
import { GalaService } from './gala.service';
import { MembershipService } from './membership.service';
import { MessageService } from './message.service';
import { MembershipPayload } from './models';

describe('Services API (contrat docs/API.md)', () => {
  const api = environment.apiUrl;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('BoxerService : filtres sans paramètres vides, fiche par slug', () => {
    TestBed.inject(BoxerService).list({ discipline: 'amateur', level: null, sex: 'F', q: '' }).subscribe();
    const req = http.expectOne((r) => r.url === `${api}/boxers`);
    expect(req.request.params.get('discipline')).toBe('amateur');
    expect(req.request.params.get('sex')).toBe('F');
    expect(req.request.params.has('level')).toBeFalse();
    expect(req.request.params.has('q')).toBeFalse();
    expect(req.request.params.get('page')).toBe('1');
    req.flush({ items: [], page: 1, limit: 12, total: 0, pages: 0 });

    TestBed.inject(BoxerService).featured().subscribe();
    http.expectOne(`${api}/boxers/featured`).flush([]);
    TestBed.inject(BoxerService).get('jean-dupont').subscribe();
    http.expectOne(`${api}/boxers/jean-dupont`).flush({});
  });

  it('GalaService : à venir par défaut, passés sur demande', () => {
    const galas = TestBed.inject(GalaService);
    galas.list().subscribe();
    expect(http.expectOne((r) => r.url === `${api}/galas`).request.params.get('when')).toBe('upcoming');
    galas.list({ when: 'past', type: 'gala' }).subscribe();
    const req = http.expectOne((r) => r.url === `${api}/galas`);
    expect(req.request.params.get('when')).toBe('past');
    expect(req.request.params.get('type')).toBe('gala');
    galas.get('gala-2026').subscribe();
    http.expectOne(`${api}/galas/gala-2026`).flush({});
  });

  it('ArticleService : catégorie, détail et commentaires', () => {
    const articles = TestBed.inject(ArticleService);
    articles.list({ category: 'gala' }).subscribe();
    expect(http.expectOne((r) => r.url === `${api}/articles`).request.params.get('category')).toBe('gala');
    articles.comments('mon-article').subscribe();
    http.expectOne(`${api}/articles/mon-article/comments`).flush([]);
    articles.addComment('mon-article', 'Bravo !').subscribe();
    const post = http.expectOne(`${api}/articles/mon-article/comments`);
    expect(post.request.method).toBe('POST');
    expect(post.request.body).toEqual({ body: 'Bravo !' });
  });

  it('ClubService : met en cache les listes quasi statiques', () => {
    const club = TestBed.inject(ClubService);
    const received: unknown[] = [];
    club.getPlanning().subscribe((v) => received.push(v));
    club.getPlanning().subscribe((v) => received.push(v));
    http.expectOne(`${api}/planning`).flush([]);
    expect(received.length).toBe(2);
    club.getClub().subscribe();
    http.expectOne(`${api}/club`).flush({});
    club.getDiscipline('boxe-educative').subscribe();
    http.expectOne(`${api}/disciplines/boxe-educative`).flush({});
  });

  it('ClubService : une erreur n’est pas mise en cache', () => {
    const club = TestBed.inject(ClubService);
    let failed = false;
    club.getPricing().subscribe({ error: () => (failed = true) });
    http.expectOne(`${api}/pricing`).flush({}, { status: 500, statusText: 'Error' });
    let ok = false;
    club.getPricing().subscribe(() => (ok = true));
    http.expectOne(`${api}/pricing`).flush([]);
    expect(failed).toBeTrue();
    expect(ok).toBeTrue();
  });

  it('MembershipService : POST /memberships, /contact et /me/memberships', () => {
    const service = TestBed.inject(MembershipService);
    const payload: MembershipPayload = {
      firstName: 'Léo',
      lastName: 'Martin',
      email: 'leo@example.test',
      phone: '0600000000',
      birthDate: '2014-04-02',
      discipline: 1,
      pricing: null,
      season: '2026-2027',
      legalGuardian: 'Anne Martin (mère)',
      medicalCertificate: true,
      message: null,
      consent: true,
    };
    service.create(payload).subscribe();
    const req = http.expectOne(`${api}/memberships`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 7, status: 'en_attente' });

    service.contact({ name: 'A', email: 'a@b.test', subject: 'Essai', message: 'Bonjour le club' }).subscribe();
    expect(http.expectOne(`${api}/contact`).request.method).toBe('POST');
    service.mine().subscribe();
    http.expectOne(`${api}/me/memberships`).flush([]);
  });

  it('MessageService : liste paginée, envoi au club, lecture', () => {
    const messages = TestBed.inject(MessageService);
    messages.list(2).subscribe();
    expect(http.expectOne((r) => r.url === `${api}/me/messages`).request.params.get('page')).toBe('2');
    messages.send('Question', 'Bonjour').subscribe();
    expect(http.expectOne(`${api}/me/messages`).request.body).toEqual({ subject: 'Question', body: 'Bonjour' });
    messages.markRead(4).subscribe();
    expect(http.expectOne(`${api}/me/messages/4/read`).request.method).toBe('POST');
  });

  it('ApiService.mediaUrl : préfixe les /uploads par l’origine de l’API', () => {
    const service = TestBed.inject(ApiService);
    expect(service.mediaUrl('/uploads/b.jpg')).toBe(`${api.replace(/\/api$/, '')}/uploads/b.jpg`);
    expect(service.mediaUrl('https://cdn.test/x.jpg')).toBe('https://cdn.test/x.jpg');
    expect(service.mediaUrl('img/logo.jpg')).toBe('img/logo.jpg');
    expect(service.mediaUrl(null)).toBeNull();
  });
});
