export interface MenuItem {
  id?: number;
  label?: string;
  ScreenName?: string;
  Value?: boolean;
  icon?: string;
  link?: string;
  subItems?: Array<MenuSubItems>;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
}

export class MenuSubItems{
  id: number;
  label:string;
  link: string;
  ScreenName: string;
  Value: boolean
  parentId: number
}

export class companymodel {
  CompanyId: number;
}
