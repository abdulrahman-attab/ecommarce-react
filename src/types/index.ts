export interface Named { _id: string; name: string; slug?: string; image?: string }
export interface Product {
  _id: string; id?: string; title: string; description?: string; imageCover: string; images?: string[];
  price: number; priceAfterDiscount?: number; ratingsAverage?: number; ratingsQuantity?: number;
  quantity?: number; sold?: number; category?: Named; brand?: Named;
}
export interface CartItem { _id: string; count: number; price: number; product: Product }
export interface Cart { _id: string; products: CartItem[]; totalCartPrice: number }
export interface CartResponse { status?: string; numOfCartItems?: number; cartId?: string; data: Cart }
export interface Order {
  _id: string; id?: number; totalOrderPrice: number; paymentMethodType: string; isPaid: boolean; isDelivered: boolean; createdAt: string;
  shippingAddress?: { details: string; phone: string; city: string };
  cartItems: { _id: string; count: number; price: number; product: Product }[];
}
export interface Address { _id: string; name: string; details: string; phone: string; city: string }
export interface Review { _id: string; review: string; rating: number; createdAt: string; user: { _id: string; name: string } }
export interface User { name: string; email: string; role?: string; id?: string }
export interface ShippingAddress { details: string; phone: string; city: string }
