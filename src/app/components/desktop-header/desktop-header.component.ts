import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.scss'],
})
export class DesktopHeaderComponent implements OnInit {
  categories: Array<any> = [
    { id: 1, name: "Home", url: "/home", icon: "home-outline" },
    { id: 1, name: "Offers", url: "/offers", icon: "flash-outline" },
    {
      id: 1,
      name: "Shop by Category",
      url: "/categories",
      icon: "grid-outline",
    },
    {
      id: 1,
      name: "Shop by Brand",
      url: "/manufacturers",
      icon: "construct-outline",
    },
  ];
  selectedCategoryIndex: number = 0;
  constructor(private router: Router) { }

  ngOnInit() { }
  navigateByUrl(index: number) {
    this.selectedCategoryIndex = index;

    this.router.navigate([this.categories[index].url]);

  }
  onNavigate(url) {

    this.router.navigate([url]);

  }
}
