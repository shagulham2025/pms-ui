import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionService } from '../../core/permission.service';

@Directive({ selector: '[appHasPermission]' })
export class HasPermissionDirective implements OnInit, OnDestroy {
  private sub: Subscription | null = null;

  // accept single permission string or array of permissions (any-of)
  @Input('appHasPermission') permissions: string | string[] | null = null;

  constructor(private tpl: TemplateRef<any>, private vc: ViewContainerRef, private perm: PermissionService) {}

  ngOnInit(): void {
    if (!this.permissions) { this.vc.clear(); return; }
    const perms = Array.isArray(this.permissions) ? this.permissions : [this.permissions];
    // subscribe to async role updates
    this.sub = this.perm.hasAnyAsync(perms).subscribe((allowed) => {
      this.vc.clear();
      if (allowed) { this.vc.createEmbeddedView(this.tpl); }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
