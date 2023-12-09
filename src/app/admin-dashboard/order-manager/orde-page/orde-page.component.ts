import { Component } from '@angular/core';
import { OrderManagerService } from '../order-manager.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-orde-page',
  templateUrl: './orde-page.component.html',
  styleUrls: ['./orde-page.component.scss']
})


export class OrdePageComponent {
  products!: any[];
  product: any;
  first = 0;
  rows = 10;
  productDialog: boolean = false;
  submitted: boolean = false;
  statuses!: any[];
  constructor(private productService: OrderManagerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.productService.getOrderData().subscribe((data) => {
      this.products = data
      console.log(data)
    });

    this.statuses = [
      { label: 'Đã thanh toán', value: '0' },
      { label: 'Chưa thanh toán', value: '1' },
      { label: 'Hủy', value: '2' }
    ];
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }


  // Trong component.ts
  extractInputValue(event: Event): string {
    if (event.target instanceof HTMLInputElement) {
      console.log(event.target.value)
      return event.target.value;
    }
    return '';
  }


  getSeverity(status: string) {
    switch (status) {
      case '2':
        return 'danger';

      case '0':
        return 'success';

      case '1':
        return 'info';

      case '3':
        return 'warning';
      default:
        return 'warning';
    }
  }

  editProduct(product: any) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: any) {
    Swal.fire({
      title: "Are you sure you want to delete " + product.orderId + '?',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Đồng ý',
      denyButtonText: 'Không'
    }).then((rs) => {
      if (rs.isConfirmed) {
        this.products = this.products.filter((val) => val.orderId !== product.orderId);
        this.product = {};
        this.toastr.success('Delete successfuly!', 'Deleted');
      }
    })
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name?.trim()) {
      if (this.product.id) {
        this.products[this.findIndexById(this.product.id)] = this.product;
        this.toastr.success('Successful', 'Product Updated');
      }
      this.products = [...this.products];
      this.productDialog = false;
      this.product = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

}
