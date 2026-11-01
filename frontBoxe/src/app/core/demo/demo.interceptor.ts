import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ArticleComment, MemberMessage, Paginated } from '../api/models';
import {
  DEMO_ARTICLES, DEMO_BOXERS, DEMO_CLUB, DEMO_COACHES, DEMO_COMMENTS, DEMO_DISCIPLINES, DEMO_GALAS,
  DEMO_PARTNERS, DEMO_PLANNING, DEMO_PRICING, DEMO_VENUES,
} from './demo-data';

/**
 * Bêta sans serveur : répond aux appels de l'API avec des données fictives.
 * Actif uniquement dans le build `demo` (environment.demo). Tout compte est accepté à la connexion.
 */
const user = {
  id: 1, email: 'demo@esctboxe.local', firstName: 'Léa', lastName: 'Démo', phone: null,
  birthDate: '2000-05-12', roles: ['ROLE_USER'], createdAt: new Date().toISOString(),
};
const memberships: unknown[] = [];
const messages: MemberMessage[] = [
  { id: 1, subject: 'Bienvenue au club (démonstration)', body: 'Message fictif du club pour tester votre messagerie.',
    createdAt: new Date().toISOString(), readAt: null, sender: null, recipient: { id: 1, firstName: 'Léa', lastName: 'Démo' } },
];

function page<T>(items: T[], params: URLSearchParams): Paginated<T> {
  const limit = Number(params.get('limit') ?? 12) || 12;
  const p = Math.max(1, Number(params.get('page') ?? 1) || 1);
  return { items: items.slice((p - 1) * limit, p * limit), page: p, limit, total: items.length, pages: Math.max(1, Math.ceil(items.length / limit)) };
}

const notFound = (url: string) => throwError(() => new HttpErrorResponse({ status: 404, url, error: { message: 'Introuvable (démo).' } }));

function route(req: HttpRequest<unknown>, path: string, q: URLSearchParams): unknown | Observable<never> {
  const m = req.method;
  const seg = path.split('/');
  const now = Date.now();

  if (m === 'GET') {
    switch (path) {
      case 'club': return DEMO_CLUB;
      case 'disciplines': return DEMO_DISCIPLINES.map(({ slots, coaches, ...d }) => d);
      case 'coaches': return DEMO_COACHES;
      case 'venues': return DEMO_VENUES;
      case 'planning': return DEMO_PLANNING;
      case 'pricing': return DEMO_PRICING;
      case 'partners': return DEMO_PARTNERS;
      case 'boxers/featured': return DEMO_BOXERS.filter((b) => b.featured);
      case 'me': return user;
      case 'me/memberships': return memberships;
      case 'me/messages': return page(messages, q);
      case 'articles': {
        const cat = q.get('category');
        return page(DEMO_ARTICLES.filter((a) => !cat || a.category === cat).map(({ content, author, ...a }) => a), q);
      }
      case 'boxers': {
        const s = (q.get('q') ?? '').toLowerCase();
        const list = DEMO_BOXERS.filter((b) =>
          (!q.get('level') || b.level === q.get('level')) && (!q.get('sex') || b.sex === q.get('sex')) &&
          (!q.get('discipline') || b.discipline?.slug === q.get('discipline')) &&
          (!s || `${b.firstName} ${b.lastName} ${b.nickname ?? ''}`.toLowerCase().includes(s)));
        return page(list.map(({ fights, record, bio, active, ...b }) => b), q);
      }
      case 'galas': {
        const past = q.get('when') === 'past';
        const list = DEMO_GALAS
          .filter((g) => (new Date(g.startsAt).getTime() < now) === past && (!q.get('type') || g.type === q.get('type')))
          .sort((a, b) => (past ? -1 : 1) * a.startsAt.localeCompare(b.startsAt));
        return page(list.map(({ fights, ...g }) => g), q);
      }
    }
    if (seg[0] === 'disciplines') return DEMO_DISCIPLINES.find((d) => d.slug === seg[1]) ?? notFound(path);
    if (seg[0] === 'boxers') return DEMO_BOXERS.find((b) => b.slug === seg[1]) ?? notFound(path);
    if (seg[0] === 'galas') return DEMO_GALAS.find((g) => g.slug === seg[1]) ?? notFound(path);
    if (seg[0] === 'articles' && seg[2] === 'comments') return DEMO_COMMENTS[seg[1]] ?? [];
    if (seg[0] === 'articles') return DEMO_ARTICLES.find((a) => a.slug === seg[1]) ?? notFound(path);
    if (path === 'me/export') return new Blob([JSON.stringify({ user, memberships, messages }, null, 2)], { type: 'application/json' });
    return notFound(path);
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  if (m === 'POST') {
    if (path === 'login' || path === 'token/refresh') return { token: 'demo-token', refresh_token: 'demo-refresh' };
    if (path === 'register' || path.startsWith('verify-email')) return { message: 'Compte de démonstration : connectez-vous avec n’importe quel e-mail.' };
    if (path === 'contact') return { message: 'Message reçu (démo : rien n’est envoyé).' };
    if (path === 'memberships') {
      const created = { id: memberships.length + 1, status: 'en_attente' as const };
      const d = DEMO_DISCIPLINES.find((x) => x.id === body['discipline']);
      const p = DEMO_PRICING.find((x) => x.id === body['pricing']);
      memberships.push({ ...body, ...created, discipline: d ? { id: d.id, name: d.name, slug: d.slug } : null,
        pricing: p ?? null, createdAt: new Date().toISOString() });
      return created;
    }
    if (path === 'me/messages') {
      const msg: MemberMessage = { id: messages.length + 1, subject: String(body['subject'] ?? ''), body: String(body['body'] ?? ''),
        createdAt: new Date().toISOString(), readAt: null, sender: { id: 1, firstName: 'Léa', lastName: 'Démo' }, recipient: null };
      messages.unshift(msg);
      return msg;
    }
    if (seg[0] === 'me' && seg[1] === 'messages' && seg[3] === 'read') {
      const msg = messages.find((x) => x.id === Number(seg[2]));
      if (msg) msg.readAt = new Date().toISOString();
      return {};
    }
    if (path === 'me/password') return { message: 'Mot de passe modifié (démo).' };
    if (seg[0] === 'articles' && seg[2] === 'comments') {
      const c: ArticleComment = { id: Date.now(), body: String(body['body'] ?? ''), createdAt: new Date().toISOString(),
        author: { firstName: 'Léa', lastName: 'D.' }, status: 'en_attente' };
      return c;
    }
  }
  if (m === 'PATCH' && path === 'me') { Object.assign(user, body); return user; }
  if (m === 'DELETE' && path === 'me') return { message: 'Compte supprimé (démo : rien n’est supprimé).' };
  return notFound(path);
}

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  const base = environment.apiUrl;
  if (!('demo' in environment) || !req.url.startsWith(base)) return next(req);
  const url = new URL(req.url);
  const path = url.pathname.replace(new URL(base).pathname, '').replace(/^\/|\/$/g, '');
  const params = new URLSearchParams(url.search);
  req.params.keys().forEach((k) => params.set(k, String(req.params.get(k))));
  const result = route(req, path, params);
  if (result instanceof Observable) return result.pipe(delay(150));
  return of(new HttpResponse({ status: 200, url: req.url, body: result })).pipe(delay(150));
};
