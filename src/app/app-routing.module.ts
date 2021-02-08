import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'product/:id',
    loadChildren: () => import('./pages/product/product.module').then(m => m.ProductPageModule)
  },
  {
    path: 'cart',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule)
  },

  {
    path: 'add-address',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/add-address/add-address.module').then(m => m.AddAddressPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./pages/otp/otp.module').then(m => m.OtpPageModule)
  },
  {
    path: 'loginmodal',
    loadChildren: () => import('./pages/loginmodal/loginmodal.module').then(m => m.LoginmodalPageModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'area-search',
    loadChildren: () => import('./pages/area-search/area-search.module').then(m => m.AreaSearchPageModule)
  },
  {
    path: 'coupon',
    loadChildren: () => import('./pages/coupon/coupon.module').then(m => m.CouponPageModule)
  },
  {
    path: 'products/:id',
    loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsPageModule)
  },
  {
    path: 'brand-products/:brand_id',
    loadChildren: () => import('./pages/brand-products/brand-products.module').then(m => m.BrandProductsPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'profile-otp',
    loadChildren: () => import('./pages/profile-otp/profile-otp.module').then(m => m.ProfileOTPPageModule)
  },
  {
    path: 'my-addresses',
    loadChildren: () => import('./pages/my-addresses/my-addresses.module').then(m => m.MyAddressesPageModule)
  },
  {
    path: 'edit-address',
    loadChildren: () => import('./pages/edit-address/edit-address.module').then(m => m.EditAddressPageModule)
  },
  {
    path: 'modeofpayment',
    loadChildren: () => import('./pages/modeofpayment/modeofpayment.module').then(m => m.ModeofpaymentPageModule)
  },
  {
    path: 'paypal',
    loadChildren: () => import('./pages/paypal/paypal.module').then(m => m.PaypalPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersPageModule)
  },
  {
    path: 'order-details',
    loadChildren: () => import('./pages/order-details/order-details.module').then(m => m.OrderDetailsPageModule)
  },
  {
    path: 'cancelorder',
    loadChildren: () => import('./pages/cancelorder/cancelorder.module').then(m => m.CancelorderPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesPageModule)
  },
  {
    path: 'offers',
    loadChildren: () => import('./pages/offer/offer.module').then(m => m.OfferPageModule)
  },
  {
    path: 'manufacturers',
    loadChildren: () => import('./pages/manufacturers/manufacturers.module').then(m => m.ManufacturersPageModule)
  },
  {
    path: 'checkout/:address_id',
    loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'order-placed',
    loadChildren: () => import('./pages/order-placed/order-placed.module').then(m => m.OrderPlacedPageModule)
  },
  {
    path: 'termsandconditions',
    loadChildren: () => import('./pages/termsandconditions/termsandconditions.module').then(m => m.TermsandconditionsPageModule)
  },
  {
    path: 'privacypolicy',
    loadChildren: () => import('./pages/privacypolicy/privacypolicy.module').then(m => m.PrivacypolicyPageModule)
  },
  {
    path: 'returnandrefund',
    loadChildren: () => import('./pages/returnandrefund/returnandrefund.module').then(m => m.ReturnandrefundPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./pages/wallet/wallet.module').then(m => m.WalletPageModule)
  },
  {
    path: 'recharge',
    loadChildren: () => import('./pages/recharge/recharge.module').then(m => m.RechargePageModule)
  },
  {
    path: 'cartmodal',
    loadChildren: () => import('./pages/cartmodal/cartmodal.module').then(m => m.CartmodalPageModule)
  },

  {
    path: 'notification',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/notification/notification.module').then(m => m.NotificationPageModule)
  },
  {
    path: 'notificationdetail',
    loadChildren: () => import('./pages/notificationdetail/notificationdetail.module').then(m => m.NotificationdetailPageModule)
  },
  {
    path: 'address-modal',
    loadChildren: () => import('./pages/address-modal/address-modal.module').then(m => m.AddressModalPageModule)
  },
  {
    path: 'recharge-status',
    loadChildren: () => import('./pages/recharge-status/recharge-status.module').then(m => m.RechargeStatusPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule)
  },
  {
    path: 'shippingpolicy',
    loadChildren: () => import('./pages/shippingpolicy/shippingpolicy.module').then(m => m.ShippingpolicyPageModule)
  },
  {
    path: 'install',
    loadChildren: () => import('./pages/install/install.module').then(m => m.InstallPageModule)
  },
  {
    path: 'successful',
    loadChildren: () => import('./pages/successful/successful.module').then(m => m.SuccessfulPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'iframe/:data',
    loadChildren: () => import('./pages/iframe/iframe.module').then( m => m.IframePageModule)
  },

  {
    path: 'iframe',
    loadChildren: () => import('./pages/iframe/iframe.module').then( m => m.IframePageModule)
  },
  {
    path: 'iframe/:id',
    loadChildren: () => import('./pages/iframe/iframe.module').then( m => m.IframePageModule)
  },
  {
    path: 'posts/:slug',
    loadChildren: () => import('./pages/iframe/iframe.module').then( m => m.IframePageModule)
  },
  {
    path: 'wallet-pay',
    loadChildren: () => import('./pages/wallet-pay/wallet-pay.module').then( m => m.WalletPayPageModule)
  },








];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
