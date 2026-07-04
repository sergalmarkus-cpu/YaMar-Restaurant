'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Edit2, Trash2, Tag } from 'lucide-react';

interface Category {
  id: number;
  name:
    | string
    | {
        es?: string;
        en?: string;
        de?: string;
      };
}

interface ProductItem {
  id: number;

  name:
    | string
    | {
        es?: string;
        en?: string;
        de?: string;
      };

  categoryId: number;

  category?: Category;

  price: number;

  available: boolean;

  image: string | null;
}

export default function ProductsList() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Cargar categorías
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success) {
  setCategories(
    catData.data.map((c: any) => ({
      id: c.id,
      name: c.name.es,
    }))
  );
}

      // Cargar productos
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      
      if (prodData.success && Array.isArray(prodData.data)) {
  setProducts(
    prodData.data.map((item: any) => ({
      id: item.product.id,
      name: item.product.name.es,
      categoryId: item.product.categoryId,
      category: {
        id: item.category.id,
        name: item.category.name.es,
      },
      price: parseFloat(item.product.price),
      available: item.product.available,
      imageUrl: item.product.image,
    }))
  );
}
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getCategoryName = (categoryId: number) => {
  const cat = categories.find(c => c.id === categoryId);

  return cat ? cat.name : "Sin categoría";
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
          <p className="text-gray-600 mt-1">
            Gestiona todos los productos disponibles
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Filtrar por categoría:</span>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
  		{typeof cat.name === "string"
    		  ? cat.name
    		  : cat.name.es ?? cat.name.en ?? cat.name.de}
	       </option>
            ))}
          </select>
          
          <button className="ml-auto text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            + Agregar Filtro →
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
			{
  			   typeof product.name === "string"
   			   ? product.name
    			   : product.name?.es ??
      			   product.name?.en ??
     			   product.name?.de ??
    			   "Sin nombre"
}
</p>
                        <p className="text-sm text-gray-500">ID: #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Tag size={12} />
                      {getCategoryName(product.categoryId)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900">
                      €{(product.price ?? 0).toFixed(2)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.available ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-600 hover:text-indigo-600 mr-3">
                      <Edit2 size={18} />
                    </button>
                    
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay productos creados
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comienza añadiendo tu primer producto
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}