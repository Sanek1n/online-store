import Component from './component';
import { TQParams } from './interface';

export class Router {
  private url: URL;
  private searchParams: URLSearchParams;
  routes: Array<Routes>;
  routeElement: HTMLElement | null;

  constructor(root: string) {
    this.url = new URL(window.location.href);
    this.searchParams = new URLSearchParams(this.url.search);
    this.routeElement = document.getElementById(root);
    this.routes = [];
  }

  public initRoutes(routes: Array<Routes>): void {
    this.routes = routes;
    this.initialize();
    this.hashChanged();
  }

  public appendParam(key: string, value: string): void {
    let search = window.location.search;
    if (search[0] === '?') search = search.slice(1);

    const array = search.split('&');
    if (array[0] === '') array.length = 0;

    const params = `${key}=${value}`;
    let deletedIdx;
    const findDelParam = array.find((el) => el.includes(key));

    if (findDelParam) {
      deletedIdx = array.indexOf(findDelParam);

      if (deletedIdx >= 0) {
        array.splice(deletedIdx, 1);
      }
    }

    if (!array.includes(params)) array.push(params);

    this.url.search = array.join('&');
    history.pushState(null, '', this.url.href);
  }

  public addParam(key: string, value: string): void {
    let search = window.location.search;
    if (search[0] === '?') search = search.slice(1);

    const array = search.split('&');
    if (array[0] === '') array.length = 0;

    const findDelParam = array.find((el) => el.includes(key));
    if (findDelParam?.includes(value)) return;
    let params;
    if (findDelParam) {
      params = `,${value}`;
    } else {
      params = `${key}=${value}`;
    }

    // let deletedIdx;

    if (!array.includes(params)) array.push(params);

    this.url.search = array.join('');
    history.pushState(null, '', this.url.href);
  }

  public removeParam(key: string, value: string): void {
    let search = window.location.search;
    if (search[0] === '?') search = search.slice(1);

    const array = search.split('&');
    if (array[0] === '') array.length = 0;

    const findDelParam = array.find((el) => el.includes(key));
    let params = '';
    if (findDelParam) {
      params = findDelParam.replace(value, '');
      params = params.replace(/=,/, '=');
      params = params.replace(/,$/, '');
      params = params.replace(/,+/, ',');
      if (/=$|=&/.test(params)) params = '';
    }

    if (!array.includes(params)) array.push(params);

    this.url.search = array[array.length - 1];
    history.replaceState(null, '', this.url.href);
  }

  private initialize(): void {
    window.addEventListener('hashchange', this.hashChanged.bind(this));
  }

  private hashChanged(): void {
    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];

      if (route.isActiveRoute()) {
        this.navigate(route.component);
      }
    }
  }

  private navigate(component: Component): void {
    fetch(component.getURLPath()).then(async (data) => {
      const html = await data.text();
      const element: HTMLElement | null = this.routeElement;

      if (element) element.innerHTML = html;

      component.init();
    });
  }

  public getObjProperties() {
    const qParams: string = window.location.search.slice(1);
    const params: string[][] = qParams.split('&').map((str) => str.split('='));
    const initialObj: TQParams = {};

    return params.reduce((init, item) => {
      init[item[0]] = item[1];
      return init;
    }, initialObj);
  }
}

export class Routes {
  component: Component;
  defaultRoute: boolean;

  constructor(component: Component, defaultRoute: boolean) {
    this.component = component;
    this.defaultRoute = defaultRoute;
  }
  public isActiveRoute(): boolean {
    const locationHash = window.location.hash;
    const path: Array<string> | null = locationHash.match(/#(\w+)/);
    const pathName: string = path ? path[1] : '';

    return pathName === this.component.getName() || this.defaultRoute;
  }
}
