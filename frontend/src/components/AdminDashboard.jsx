// import { useState, useEffect } from "react";
// import axiosInstance from "../axiosInstance";

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetchOrders();
//     fetchProducts();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await axiosInstance.get("/orders/admin-orders");
//       setOrders(response.data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get("/admin-products/my-products");
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       await axiosInstance.put("/orders/update-status", { orderId, status });
//       fetchOrders();
//     } catch (error) {
//       console.error("Error updating order:", error);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Admin Dashboard</h1>

//       <div style={{ marginTop: "30px" }}>
//         <h2>Your Orders</h2>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Customer</th>
//               <th>Product</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order._id} style={{ borderBottom: "1px solid #ddd" }}>
//                 <td>{order.orderId}</td>
//                 <td>
//                   {order.userDetails.firstName} {order.userDetails.lastName}
//                 </td>
//                 <td>{order.productId.name}</td>
//                 <td>{order.orderStatus}</td>
//                 <td>
//                   <select
//                     value={order.orderStatus}
//                     onChange={(e) =>
//                       updateOrderStatus(order._id, e.target.value)
//                     }
//                   >
//                     <option>Pending</option>
//                     <option>Confirmed</option>
//                     <option>Shipped</option>
//                     <option>Delivered</option>
//                     <option>Cancelled</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={{ marginTop: "30px" }}>
//         <h2>Your Products ({products.length})</h2>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3, 1fr)",
//             gap: "20px",
//           }}
//         >
//           {products.map((product) => (
//             <div
//               key={product._id}
//               style={{ border: "1px solid #ddd", padding: "10px" }}
//             >
//               <h3>{product.name}</h3>
//               <p>Price: ₹{product.price}</p>
//               <p>Stock: {product.stock}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
