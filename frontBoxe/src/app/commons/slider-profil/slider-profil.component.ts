import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  ElementRef,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-slider-profil',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './slider-profil.component.html',
  styleUrls: ['./slider-profil.component.css'],
})
export class SliderProfilComponent {
  startX: number = 0;
  currentTranslateX: number = 0;
  isDragging: boolean = false;
  transform: string = 'translateX(0px)';
  containerWidth: number = 0;
  sliderContentWidth: number = 0;
  maxTranslateX: number = 0;
  selectedMenu: string = 'menu1';
  isDesktop: boolean = window.innerWidth >= 768;

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateSelectedMenu();
      }
    });
  }

  ngAfterViewInit() {
    const container = this.el.nativeElement.querySelector('.container');
    const sliderContent = this.el.nativeElement.querySelector('.sliderContent');
    this.containerWidth = container.offsetWidth;
    this.sliderContentWidth = sliderContent.scrollWidth;
    this.maxTranslateX = this.containerWidth - this.sliderContentWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isDesktop = window.innerWidth >= 769;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.startX = event.clientX;
    this.isDragging = true;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const moveX = event.clientX - this.startX;
      let newTranslateX = this.currentTranslateX + moveX;
      newTranslateX = Math.max(this.maxTranslateX, Math.min(0, newTranslateX));
      this.transform = `translateX(${newTranslateX}px)`;
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;
    const moveX = event.clientX - this.startX;
    this.currentTranslateX = Math.max(
      this.maxTranslateX,
      Math.min(0, this.currentTranslateX + moveX)
    );
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.isDragging = true;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isDragging) {
      const moveX = event.touches[0].clientX - this.startX;
      let newTranslateX = this.currentTranslateX + moveX;
      newTranslateX = Math.max(this.maxTranslateX, Math.min(0, newTranslateX));
      this.transform = `translateX(${newTranslateX}px)`;
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.isDragging = false;
    const moveX = event.changedTouches[0].clientX - this.startX;
    this.currentTranslateX = Math.max(
      this.maxTranslateX,
      Math.min(0, this.currentTranslateX + moveX)
    );
  }

  onSelectMenu(menu: string) {
    this.selectedMenu = menu;
    this.cdr.detectChanges();
  }

  updateSelectedMenu() {
    const url = this.router.url;
    if (url.includes('/suivis')) {
      this.selectedMenu = 'menu1';
    } else if (url.includes('/modifProfil')) {
      this.selectedMenu = 'menu2';
    } else if (url.includes('/modifMdp')) {
      this.selectedMenu = 'menu3';
    } else if (url.includes('/suppCompte')) {
      this.selectedMenu = 'menu4';
    } else if (url.includes('/boxeurs')) {
      this.selectedMenu = 'menu5';
    }
    this.cdr.detectChanges();
  }

  getDivClass(menu: string): { [key: string]: boolean } {
    const isActive = this.selectedMenu === menu;
    return {
      menuSuivi: menu === 'menu1' && isActive,
      menuInfo: menu === 'menu2' && isActive,
      menuMdp: menu === 'menu3' && isActive,
      menuDelete: menu === 'menu4' && isActive,
      menuBoxeur: menu === 'menu5' && isActive,
      menuSuiviInactive: !isActive && this.selectedMenu === 'menu1',
      menuInfoInactive: !isActive && this.selectedMenu === 'menu2',
      menuMdpInactive: !isActive && this.selectedMenu === 'menu3',
      menuDeleteInactive: !isActive && this.selectedMenu === 'menu4',
      menuBoxeurInactive: !isActive && this.selectedMenu === 'menu',
    };
  }

  getImgClass(menu: string): { [key: string]: boolean } {
    const isActive = this.selectedMenu === menu;
    return {
      iconWhite: isActive,
      iconInactiveSuivi: !isActive && this.selectedMenu === 'menu1',
      iconInactiveInfo: !isActive && this.selectedMenu === 'menu2',
      iconInactiveMdp: !isActive && this.selectedMenu === 'menu3',
      iconInactiveDelete: !isActive && this.selectedMenu === 'menu4',
      iconInactiveBoxeur: !isActive && this.selectedMenu === 'menu5',
    };
  }

  isNotSelected(menu: string): boolean {
    return this.selectedMenu !== menu && this.selectedMenu !== '';
  }
}
