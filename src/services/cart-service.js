import { cartModel, productModel } from '../db';
import { calculateCartPrice } from '../utils/calculate-cart-cost';

class CartService {
  constructor(cartModel, productModel) {
    this.cartModel = cartModel;
    this.productModel = productModel;
  }
  async addCartItem(DTO) {
    const { product_id, quantity, user_id } = DTO;
    const [productCart, product] = await Promise.all([
      await this.cartModel.readCartByProduct({ user_id, product_id }),
      await this.productModel.findById(product_id),
    ]);
    console.log('product', product[0].price);

    if (productCart?.product_id?._id?.toString() === product_id) {
      const { _id, quantity } = productCart;
      const { product_cost } = product.price;
      const updatedCartCost = calculateCartPrice(product_cost, quantity + 1);
      const DTO_s = { _id, quantity: quantity + 1, cart_price: updatedCartCost };
      const updatedCart = await this.cartModel.update(DTO_s);
      return updatedCart;
    }

    DTO.cart_price = calculateCartPrice(product[0].price.product_cost, quantity);
    const createdCart = await this.cartModel.create(DTO);
    return createdCart;
  }
  async addCartItems(DTO) {
    const { cart_items, user_id } = DTO;
    const created_items = [];
    for (const item of cart_items) {
      const { product_id, quantity } = item;
      const product = await this.productModel.findById(product_id);
      const cart_price = calculateCartPrice(product[0].price.product_cost, quantity);
      const DTO_s = { product_id, quantity, user_id, cart_price };
      const createdItem = await this.cartModel.create(DTO_s);
      created_items.push(createdItem);
    }
    return created_items;
  }
  async readAllItems(DTO) {
    const allItems = await this.cartModel.readAll(DTO);
    return allItems;
  }
  async deleteAll(DTO) {
    await this.cartModel.deleteAll(DTO);
    return;
  }
  async deleteOne(DTO) {
    const deletedCart = await this.cartModel.delete(DTO);
    return deletedCart;
  }
  async deleteSome(DTO) {
    const { deleted_ids } = DTO;
    const deletedItems = [];
    for (const _id of deleted_ids) {
      DTO._id = _id;
      const deleted_item = await this.cartModel.delete(DTO);
      deletedItems.push(deleted_item);
    }
    return deletedItems;
  }
  async updateOne(DTO) {
    const { _id, quantity } = DTO;
    const cart = await this.cartModel.read(DTO);
    const { product_cost } = cart.product_id.price;
    const cart_price = calculateCartPrice(product_cost, quantity);
    const DTO_s = { _id, quantity, cart_price };
    const updatedCart = await this.cartModel.update(DTO_s);
    return updatedCart;
  }
}

const cartService = new CartService(cartModel, productModel);
export { cartService };
