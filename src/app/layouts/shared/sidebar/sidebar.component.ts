import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import MetisMenu from "metismenujs/dist/metismenujs";
import { Router, NavigationEnd } from "@angular/router";
import { EventService } from "../../../core/services/event.service";
import { MENU } from "./menu";
import { MenuItem, companymodel, MenuSubItems } from "./menu.model";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { DxFormComponent } from "devextreme-angular";
import { GlobalConstant } from "src/app/Common/global-constant";
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: [],
})
export class SidebarComponent  implements OnInit, AfterViewInit {
  menu: any;
  menuItems = [];
  haverightsList = [];
  CompanyformPopup: boolean = false;
  @ViewChild("sideMenu") sideMenu: ElementRef;
  @ViewChild("CompanyForm", { static: false })
  CompanyForm: DxFormComponent;
  CompanyFormData: companymodel;
  constructor(private eventService: EventService, private router: Router, private commonService: CommonBaseService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
      }
    });
  }
  ngOnInit(): void {
    this.CompanyFormData = new companymodel();
    this.initialize();
    // this.coloredSidebar();
    // this.lightSidebar();
    // this.compactSidebar();
    // this.iconSidebar();
    // this.boxedLayout();
    this.ScreenViewRightByUserId();
  }
  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);
    this._activateMenuDropdown();
  }
  /**
   * remove active and mm-active class
   */
  _removeAllClass(className) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }
  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass("mm-active");
    this._removeAllClass("mm-show");
    const links = document.getElementsByClassName("side-nav-link-ref");
    let menuItemEl = null;
    const paths = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < links.length; i++) {
      // tslint:disable-next-line: no-string-literal
      paths.push(links[i]["pathname"]);
    }
    const itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf("/");
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add("active");
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add("mm-active");
        const parent2El = parentEl.parentElement.closest("ul");
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.add("mm-show");
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== "side-menu") {
            parent3El.classList.add("mm-active");
            const childAnchor = parent3El.querySelector(".has-arrow");
            const childDropdown = parent3El.querySelector(".has-dropdown");
            if (childAnchor) {
              childAnchor.classList.add("mm-active");
            }
            if (childDropdown) {
              childDropdown.classList.add("mm-active");
            }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== "side-menu") {
              parent4El.classList.add("mm-show");
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== "side-menu") {
                parent5El.classList.add("mm-active");
                const childanchor = parent5El.querySelector(".is-parent");
                if (childanchor && parent5El.id !== "side-menu") {
                  childanchor.classList.add("mm-active");
                }
              }
            }
          }
        }
      }
    }
  }
  ScreenViewRightByUserId() {
    this.commonService
      .getViewRightsByUserId({
        EntryUser: this.commonService.UserId(),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          // console.log(result)
          this.haverightsList = [];
          this.haverightsList = result;
          GlobalConstant.ScreenRightList = result;
          if (this.haverightsList.length > 0) {
            // this.filteredMenu();
            this.FilterMenu(result);
          }
        },
        (error) => console.log(error)
      );
  }
  GenerateHeaderData(data, BaseColumnName) {
    let headerArray = [];
    if (data != null && data != undefined) {
      for (let i = 0; i < data.length; i++) {
        if (i == 0) {
          headerArray.push(data[i]);
        } else if (i > 0) {
          let flag = false;
          for (let j = 0; j < headerArray.length; j++) {
            if (headerArray[j][BaseColumnName] == data[i][BaseColumnName]) {
              flag = true;
              break;
            }
          }
          if (flag == false) {
            headerArray.push(data[i]);
          }
        }
      }
    }
    return headerArray;
  }
  FilterMenu(data) {
    let filteredRights = data.filter(({ Value }) => Value == true);
    if (filteredRights != null && filteredRights != undefined && filteredRights.length>0) {
      let MODULELIST=this.GenerateHeaderData(filteredRights,"ModuleDescription")
      let  MENULIST:Array<MenuItem>=[];
      let ModuleId=0;
      for(let i=0;i<MENU.length;i++)
      {
        for(let j=0;j<MODULELIST.length;j++)
        {
          if(MODULELIST[j].ModuleDescription==MENU[i].label)
          {
            let SubItemsList:Array<MenuSubItems>=[];
            let SubItemId: number=0

            for(let h=0;h<MENU[i].subItems.length;h++)
            {
              let subItemObject=filteredRights.find(({ScreenName})=>ScreenName==MENU[i].subItems[h].ScreenName )
              if(subItemObject!=null && subItemObject!=undefined)
              {
                SubItemId+=1;
                SubItemsList.push({
                  id: SubItemId,
                  label: MENU[i].subItems[h].label,
                  ScreenName: MENU[i].subItems[h].ScreenName,
                  link: MENU[i].subItems[h].link,
                  Value: true,
                  parentId: ModuleId
                })
              }
            }
            ModuleId+=1;
            MENULIST.push({
                id: ModuleId,
                label: MENU[i].label,
                Value: true,
                icon: MENU[i].icon,
                subItems: SubItemsList
            })
          }
        }
      }
      this.menuItems=MENULIST;
    }
    else{
      this.menuItems=[]
    }
  }
  filteredMenu() {
    for (let obj of this.haverightsList) {
      let menus = MENU.find(({ label }) => label === obj.ModuleDescription);
      menus && menus.Value === obj.Value;
      if (menus) {
        // let subitem = menus.subItems.find(({ label }) => label == obj.ScreenAlias);
        let subitem = menus.subItems.find(({ ScreenName }) => ScreenName == obj.ScreenName);
        subitem && (subitem.Value = obj.Value);
      }
    }
    for (let obj of MENU) {
      obj.subItems && obj.subItems.length > 0 && obj.subItems.length == obj.subItems.filter(({ Value }) => Value == false).length && (obj.Value = false);
    }
    this.menuItems = MENU;
  }
  /**
   * Initialize
   */
  initialize(): void {
    this.menuItems = MENU;
  }
  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }
  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast("changeLayout", layout);
  }
  /**
   * Light sidebar
   */
  lightSidebar() {
    document.body.setAttribute("data-sidebar", "light");
    document.body.setAttribute("data-topbar", "dark");
    document.body.removeAttribute("data-sidebar-size");
    document.body.removeAttribute("data-layout-size");
    document.body.removeAttribute("data-keep-enlarged");
    document.body.classList.remove("vertical-collpsed");
  }
  /**
   * Compact sidebar
   */
  compactSidebar() {
    document.body.setAttribute("data-sidebar-size", "small");
    document.body.setAttribute("data-sidebar", "dark");
    document.body.removeAttribute("data-topbar");
    document.body.removeAttribute("data-layout-size");
    document.body.removeAttribute("data-keep-enlarged");
    document.body.classList.remove("sidebar-enable");
    document.body.classList.remove("vertical-collpsed");
  }
  /**
   * Icon sidebar
   */
  iconSidebar() {
    document.body.classList.add("sidebar-enable");
    document.body.classList.add("vertical-collpsed");
    document.body.setAttribute("data-sidebar", "dark");
    document.body.removeAttribute("data-layout-size");
    document.body.removeAttribute("data-keep-enlarged");
    document.body.removeAttribute("data-topbar");
  }
  /**
   * Boxed layout
   */
  boxedLayout() {
    document.body.setAttribute("data-keep-enlarged", "true");
    document.body.setAttribute("data-layout-size", "boxed");
    document.body.setAttribute("data-sidebar", "dark");
    document.body.classList.add("vertical-collpsed");
    document.body.classList.remove("sidebar-enable");
    document.body.removeAttribute("data-topbar");
  }
  /**
   * Colored sidebar
   */
  coloredSidebar() {
    document.body.setAttribute("data-sidebar", "colored");
    document.body.removeAttribute("data-sidebar-size");
    document.body.removeAttribute("data-layout-size");
    document.body.classList.remove("vertical-collpsed");
    document.body.removeAttribute("data-topbar");
  }
}
