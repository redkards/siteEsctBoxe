import { Pipe, PipeTransform, inject } from '@angular/core';
import { ApiService } from '../../core/api/api.service';

/** Chemin d'image de l'API (`/uploads/...`) → URL affichable ; repli facultatif */
@Pipe({ name: 'media' })
export class MediaPipe implements PipeTransform {
  private readonly api = inject(ApiService);

  transform(path: string | null | undefined, fallback: string | null = null): string | null {
    return this.api.mediaUrl(path) ?? fallback;
  }
}
