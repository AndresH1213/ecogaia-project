import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/Product';
import Swal from 'sweetalert2';
import { ProductsService } from '../../services/products.service';
import { FileUploadService } from '../../services/file-upload.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  selectedProductID: string = '';
  selectedProduct: Product | undefined;

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    code: ['', [Validators.required, Validators.minLength(3)]],
    price: ['', [Validators.required, Validators.min(1)]],
    image: [null],
    characteristicName: [''],
    characteristicValue: [''],
  });

  public characteristic: any = {};
  public characteristicKeys: string[] = [];
  public showCharacteristics: boolean = false;

  public inputFileImage: boolean = false;
  public inputImageStateText = 'Subir';
  public tooltipImageStateText = 'Subir imagen desde PC';

  constructor(
    private fb: FormBuilder,
    private admin: AdminService,
    private productService: ProductsService,
    private uploadFile: FileUploadService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products.map(
        ({ _id, name, code, price, imageUrl, characteristics }) => {
          return new Product(_id, name, price, imageUrl, characteristics, code);
        }
      );
    });
  }

  loadProductData(prodId: string) {
    // reset previuos product data
    this.characteristicKeys = [];
    this.characteristic = {};
    this.characteristicKeys = [];
    this.showCharacteristics = false;

    if (!prodId) {
      this.selectedProduct = undefined;
      return this.productForm.reset();
    }

    // When a product is selected for modification
    this.productService.getSingleProduct(prodId!).subscribe((product) => {
      const {
        name,
        code,
        price,
        imageUrl,
        characteristics: characteristicsDB,
      } = product;
      this.selectedProduct = product;

      // Atributes of the form, these are set this way for DIV representation of the characteristics in the HTML
      let characteristicKey = '';
      let characteristicValue = [];

      // check for characteristic of the product and assign to the global variable in case of future modifications made by user
      if (!!Object.keys(characteristicsDB).length) {
        // assign the characteristicDB to the global variable and returns the key and value in order to fill the form inputs
        [characteristicKey, characteristicValue] =
          this.setCharacteristicGlobalVariable(characteristicsDB);
      }

      this.productForm.setValue({
        name,
        code,
        price,
        image: imageUrl![0] || 'no-image',
        characteristicName: characteristicKey,
        characteristicValue: characteristicValue,
      });
    });
  }

  setCharacteristicGlobalVariable(characteristicsDB: any) {
    // if the product has characteristcis, load with the first one for UX
    let characteristicKey = Object.keys(characteristicsDB!)[0];
    let characteristicValue = characteristicsDB[characteristicKey];
    // if characteristic value is retrieve as string is coverted to array because it can be more than one option
    if (!Array.isArray(characteristicValue)) {
      characteristicValue = [characteristicValue];
    }

    // set every characteristic of the product retrieve from DB to the characteristiv memory variable
    this.characteristic = characteristicsDB;
    return [characteristicKey, characteristicValue];
  }

  addCharacteristic() {
    if (
      !this.productForm.get('characteristicName')?.value ||
      !this.productForm.get('characteristicValue')?.value
    ) {
      return; // do nothing if there no value in one of the input key or value
    }
    this.showCharacteristics = true;
    const characteristicKey = this.productForm.get('characteristicName')?.value;
    const characteristicValue = this.productForm.get(
      'characteristicValue'
    )?.value;

    // if characteristic >1 the values must be provided separate by comas
    let characteristicSet = characteristicValue;

    if (typeof characteristicValue === typeof 'string') {
      characteristicSet = characteristicValue.split(',');
    }
    // add this new characteristics to the characteristic object
    this.characteristic = {
      ...this.characteristic,
      [characteristicKey]: characteristicSet,
    };
    this.characteristicKeys = Object.keys(this.characteristic);
  }

  createProduct() {
    const productData = this.productForm.value;
    // if theres a characteristic in the characteristicObject add to the productData
    // this because in the produc form we store only charcName and charcValue
    if (this.characteristic) {
      productData.characteristics = JSON.stringify(this.characteristic);
    }
    this.productService.addProduct(productData).subscribe(
      (resp: any) => {
        if (resp.ok) {
          Swal.fire(
            'New product added!',
            `New Product ${productData.name}`,
            'success'
          );

          this.productForm.reset();
          this.characteristic = {};
          this.characteristicKeys = [];
          this.loadProducts();
        } else {
          Swal.fire('Opps', 'A error ocurrs', 'error');
        }
      },
      (err) => {
        Swal.fire('err', err.error.msg, 'error');
      }
    );
  }

  edit() {
    const prodId = this.selectedProductID;
    const { name, price, image } = this.productForm.value;

    let data: any = {
      name,
      price,
      image,
    };

    if (this.characteristic) {
      data.characteristics = JSON.stringify(this.characteristic);
    }

    this.productService.updateProduct(prodId!, data).subscribe(
      (resp) => {
        if (resp.ok) {
          Swal.fire('Updated!', resp.msg, 'success');
        }
      },
      (err) => {
        Swal.fire('Error', `Ups something happend`, 'error');
      }
    );
  }

  deleteProduct() {
    Swal.fire({
      title: 'Delete Product?',
      text: `You are going to delete the product with name: ${this.selectedProduct?.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService
          .deleteProduct(this.selectedProductID!)
          .subscribe((resp) => {
            Swal.fire('Deleted!', `${resp.msg}`, 'success');
            this.loadProducts();
            this.selectedProduct = undefined;
          });
      }
    });
  }

  showIputFileImage() {
    this.inputFileImage = this.inputFileImage ? false : true;
    this.inputImageStateText =
      this.inputImageStateText === 'URL' ? 'Subir' : 'URL';
    this.tooltipImageStateText =
      this.inputImageStateText === 'URL'
        ? 'Asignar imagen por URL'
        : 'Subir imagen desde PC';

    // reset the previuos input value
    this.productForm.get('image')?.reset();
  }

  onImageChange(target: any) {
    const [file] = target.files;
    if (file) {
      this.productForm.patchValue({ image: file });
    }
  }

  uploadFileImage(toUpdate: boolean) {
    const file = this.productForm.get('image')?.value;
    if (!file) {
      Swal.fire('No file', 'No has subido ningún archivo todavía', 'warning');
      return;
    }
    // to update replace the first image (cover image)
    if (toUpdate) {
      this.uploadFile
        .updatePhoto(file, 'product', this.selectedProductID, true)
        .then((resp) => {
          Swal.fire(
            'Success',
            `imagen con el nombre ${resp} agregada`,
            'success'
          );
        })
        .catch((err) =>
          Swal.fire('Ups', `Ocurrio el siguiente error: ${err} `, 'error')
        );
      return;
    }
    this.uploadFile
      .updatePhoto(file, 'product', this.selectedProductID)
      .then((resp) => {
        Swal.fire(
          'Success',
          `imagen con el nombre ${resp} agregada`,
          'success'
        );
      })
      .catch((err) =>
        Swal.fire('Ups', `Ocurrio el siguiente error: ${err} `, 'error')
      );
  }

  logOut() {
    this.admin.logOut();
  }
}
