import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'cart',
    canActivate:[AuthGuard],
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'address',
    canActivate:[AuthGuard],
    loadChildren: () => import('./pages/address/address.module').then( m => m.AddressPageModule)
  },
  {
    path: 'add-address',
    canActivate:[AuthGuard],
    loadChildren: () => import('./pages/add-address/add-address.module').then( m => m.AddAddressPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./pages/otp/otp.module').then( m => m.OtpPageModule)
  },
  {
    path: 'loginmodal',
    loadChildren: () => import('./pages/loginmodal/loginmodal.module').then( m => m.LoginmodalPageModule)
  },
  {
    path: 'profile',
    canActivate:[AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'imagemodal',
    loadChildren: () => import('./pages/imagemodal/imagemodal.module').then( m => m.ImagemodalPageModule)
  },
  {
    path: 'area-search',
    loadChildren: () => import('./pages/area-search/area-search.module').then( m => m.AreaSearchPageModule)
  },
  {
    path: 'coupon',
    loadChildren: () => import('./pages/coupon/coupon.module').then( m => m.CouponPageModule)
  },
  {
    path: 'products/:id',
    loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'filters',
    loadChildren: () => import('./pages/filters/filters.module').then( m => m.FiltersPageModule)
  },
  {
    path: 'sort',
    loadChildren: () => import('./pages/sort/sort.module').then( m => m.SortPageModule)
  },
  {
    path: 'otpmodal',
    loadChildren: () => import('./pages/otpmodal/otpmodal.module').then( m => m.OtpmodalPageModule)
  },
  {
    path: 'brand-products',
    loadChildren: () => import('./pages/brand-products/brand-products.module').then( m => m.BrandProductsPageModule)
  },  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'profile-otp',
    loadChildren: () => import('./pages/profile-otp/profile-otp.module').then( m => m.ProfileOTPPageModule)
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
