"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Plus } from "lucide-react";
import type { Menu, Product, TranslatedText } from "@/types";
import { formatCurrency, getTimeUntilOpening } from "@/lib/utils";

export function MenuList() {
  const { session, establishment, language, addToCart } = useStore();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (establishment) {
      fetchMenus();
    }
  }, [establishment]);

  const fetchMenus = async () => {
    try {
      const response = await fetch(
        `/api/menus?establishmentId=${establishment?.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setMenus(data);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTranslation = (text: TranslatedText | undefined): string => {
    if (!text) return "";
    return text[language] || text.es || Object.values(text)[0] || "";
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      product,
      quantity: 1,
      selectedModifiers: [],
      notes: "",
      subtotal: parseFloat(product.price),
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Loading menus...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Menus</h2>
        <p className="text-gray-600">
          Browse our selection and add items to your cart
        </p>
      </div>

      {menus.map((menu) => (
        <div key={menu.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{getTranslation(menu.name)}</h3>
              {menu.description && (
                <p className="text-sm text-gray-600">
                  {getTranslation(menu.description)}
                </p>
              )}
            </div>
            {menu.isOpen ? (
              <Badge variant="success">Open</Badge>
            ) : (
              <Badge variant="warning">Closed</Badge>
            )}
          </div>

          {!menu.isOpen && menu.nextOpeningTime && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg text-sm">
              <Clock size={16} className="text-yellow-600" />
              <span className="text-yellow-800">
                Opens in {getTimeUntilOpening(menu.nextOpeningTime)}
              </span>
            </div>
          )}

          {menu.isOpen && (
            <div className="space-y-6">
              {menu.categories.map((category) => (
                <div key={category.id}>
                  <h4 className="font-semibold mb-3">
                    {getTranslation(category.name)}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.products.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={getTranslation(product.name)}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {getTranslation(product.name)}
                              </CardTitle>
                              {product.description && (
                                <CardDescription className="mt-1">
                                  {getTranslation(product.description)}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {product.featured && (
                              <Badge variant="default">Featured</Badge>
                            )}
                            {product.dailySpecial && (
                              <Badge variant="secondary">Daily Special</Badge>
                            )}
                            {product.dietary.map((diet) => (
                              <Badge key={diet} variant="outline">
                                {diet}
                              </Badge>
                            ))}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">
                              {formatCurrency(product.price, establishment?.currency)}
                            </span>
                            {product.available ? (
                              <Button
                                size="sm"
                                onClick={() => handleAddToCart(product)}
                              >
                                <Plus size={16} className="mr-1" />
                                Add
                              </Button>
                            ) : (
                              <Badge variant="destructive">Out of Stock</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
