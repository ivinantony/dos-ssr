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
    path: 'product/:id',
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
    path: 'brand-products/:brand_id',
    loadChildren: () => import('./pages/brand-products/brand-products.module').then( m => m.BrandProductsPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'profile-otp',
    loadChildren: () => import('./pages/profile-otp/profile-otp.module').then( m => m.ProfileOTPPageModule)
  },
  {
    path: 'my-addresses',
    loadChildren: () => import('./pages/my-addresses/my-addresses.module').then( m => m.MyAddressesPageModule)
  },
  {
    path: 'edit-address',
    loadChildren: () => import('./pages/edit-address/edit-address.module').then( m => m.EditAddressPageModule)
  },
  {
    path: 'modeofpayment',
    loadChildren: () => import('./pages/modeofpayment/modeofpayment.module').then( m => m.ModeofpaymentPageModule)
  },
  {
    path: 'paypal',
    loadChildren: () => import('./pages/paypal/paypal.module').then( m => m.PaypalPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'order-details',
    loadChildren: () => import('./pages/order-details/order-details.module').then( m => m.OrderDetailsPageModule)
  },
  {
    path: 'cancelorder',
    loadChildren: () => import('./pages/cancelorder/cancelorder.module').then( m => m.CancelorderPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'offer',
    loadChildren: () => import('./pages/offer/offer.module').then( m => m.OfferPageModule)
  },
  {
    path: 'manufacturers',
    loadChildren: () => import('./pages/manufacturers/manufacturers.module').then( m => m.ManufacturersPageModule)
  },
  {
    path: 'paytabs',
    loadChildren: () => import('./pages/paytabs/paytabs.module').then( m => m.PaytabsPageModule)
  },
  
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'recommended',
    loadChildren: () => import('./pages/recommended/recommended.module').then( m => m.RecommendedPageModule)
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
