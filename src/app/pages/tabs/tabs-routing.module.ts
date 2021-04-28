import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesPageModule)
      },
      {
        path: 'offers',
        loadChildren: () => import('../offer/offer.module').then(m => m.OfferPageModule)
      },
      {
        path: 'cart',
        canActivate: [AuthGuard],
        loadChildren: () => import('../cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'offers',
        loadChildren: () => import('../offer/offer.module').then(m => m.OfferPageModule)
      },
      {
        path: 'notifications',
        canActivate: [AuthGuard],
        loadChildren: () => import('../notification/notification.module').then(m => m.NotificationPageModule)
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'products/:id',
        loadChildren: () => import('../products/products.module').then(m => m.ProductsPageModule)
      },
      {
        path: 'manufacturers',
        loadChildren: () => import('../manufacturers/manufacturers.module').then(m => m.ManufacturersPageModule)
      },
      {
        path: 'brand-products/:brand_id',
        loadChildren: () => import('../brand-products/brand-products.module').then(m => m.BrandProductsPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
