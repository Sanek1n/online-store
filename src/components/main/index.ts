import Component from '../../common/component';
import { products } from '../../products';
import { IProduct } from '../../common/interface';
import RendererProducts from './renderer';
import './style.scss';
import { Router } from '../../common/router';
import Filter from './filter';

export default class Main extends Component {
  private renderer: RendererProducts;
  private filter: Filter;
  private router: Router;
  private data: Array<IProduct>;

  constructor(name: string, router: Router) {
    super(name);
    this.data = products;
    this.renderer = new RendererProducts('.products__catalog');
    this.filter = new Filter();
    this.router = router;
  }

  init() {
    this.renderer.init();
    this.renderer.render(this.data);
    this.initEvents();
  }

  public getData(): Array<IProduct> {
    return this.data;
  }

  private initEvents() {
    this.handlerProductLayout();
    this.handlePriceFilter();
    this.handleStockFilter();
  }

  private handlerProductLayout() {
    const btnWrapper = document.querySelector<HTMLDivElement>('.layout');

    if (btnWrapper) {
      btnWrapper.addEventListener('click', (e) => {
        this.renderer.onChangeProductLayout(e);
        this.changeQueryParam(btnWrapper);
      });
    }
  }

  changeQueryParam(btnWrapper: HTMLDivElement) {
    const collection: HTMLCollection = btnWrapper.children;
    const btnArr = Array.from(collection);
    const active = btnArr.find((btn) => btn.className.includes('layout__btn_active'));

    if (active && active.className.includes('layout__btn_row')) {
      this.router.deleteParam('productLayout');
      this.router.appendParam('productLayout', 'row');
    } else {
      this.router.deleteParam('productLayout');
      this.router.appendParam('productLayout', 'grid');
    }
  }

  private handlePriceFilter() {
    const priceFilter = document.querySelector<HTMLDivElement>('.range-filter__control_price');

    if (priceFilter) {
      priceFilter.addEventListener('change', (e) => this.filter.onChangePriceAmount(e));
    }
  }

  private handleStockFilter() {
    const stockFilter = document.querySelector<HTMLDivElement>('.range-filter__control_stock');

    if (stockFilter) {
      stockFilter.addEventListener('change', (e) => this.filter.onChangeStockAmount(e));
    }
  }
}
