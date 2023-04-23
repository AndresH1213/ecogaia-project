import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/Product';
import Swal from 'sweetalert2';
import { ProductsService } from '../../services/products.service';
import { FileUploadService } from '../../services/file-upload.service';
import { AdminService } from '../../services/admin.service';
import { filter, concatMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
    imageUrl: [''],
    characteristicName: [''],
    characteristicValue: [''],
  });
  public image: any;

  public characteristic: any = {};
  public characteristicKeys: string[] = [];
  public showCharacteristics: boolean = false;

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
        imageUrl: imageUrl![0] || 'no-image',
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

  edit(replaceImage = false) {
    const prodId = this.selectedProductID;
    const { name, price, imageUrl } = this.productForm.value;

    let data: any = {
      name,
      price,
      imageUrl,
      replaceImage,
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

  onImageChange(target: any) {
    if (!target.files) return;
    const file = (target.files as FileList)[0];
    this.image = file;
  }

  uploadFileImage() {
    if (!this.image) {
      Swal.fire('No file', 'No has subido ningún archivo todavía', 'warning');
      return;
    }

    const uploadfileSource = this.uploadFile.getPresignedUrls(this.image).pipe(
      filter((resp: any) => resp.ok),
      concatMap(({ signedUrl }: any) => {
        return this.uploadFile.uploadfileAWSS3(
          signedUrl,
          this.image.type,
          this.image
        );
      })
    );
    return uploadfileSource;
  }

  addFileImage(replaceImage = false) {
    this.uploadFileImage()
      ?.pipe(filter((resp: any) => resp.status === 200))
      .subscribe(
        (resp: any) => {
          console.log({ resp });
          const imageUrl = resp.url.split('?')[0];
          this.productForm.setValue({ ...this.productForm.value, imageUrl });
          this.edit(replaceImage);
        },
        (err) => {
          if (err) {
            Swal.fire('Fail upload', 'Error subiendo la imagen', 'error');
            return;
          }
        }
      );
  }

  createProduct() {
    const productData = this.productForm.value;
    // if theres a characteristic in the characteristicObject add to the productData
    // this because in the produc form we store only charcName and charcValue
    if (this.characteristic) {
      productData.characteristics = JSON.stringify(this.characteristic);
    }

    try {
      const image_source = this.uploadFileImage();

      if (image_source) {
        image_source
          .pipe(
            filter((resp: any) => resp.status === 200),
            concatMap((resp: any) => {
              const imageUrl = resp.url.split('?')[0];
              const body = {
                ...productData,
                imageUrl,
              };

              return this.productService.addProduct(body);
            }),
            catchError((err) => {
              Swal.fire('Opps', 'No se pudo crear el producto', 'error');
              return of('Producto no creado');
            })
          )
          .subscribe(
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
                this.image = undefined;
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
    } catch (error) {
      console.log(error);
      Swal.fire('Ocurrio un problema', 'Problema al subir la imagen', 'error');
    }
  }

  logOut() {
    this.admin.logOut();
  }
}
