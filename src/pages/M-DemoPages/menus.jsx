import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  X,
  Save,
  ChefHat,
  ArrowLeft,
  Salad
} from "lucide-react";
import AddMenu from "../../components/UserForms/M-addMenu";

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menuFoods, setMenuFoods] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const [menuForm, setMenuForm] = useState({
    menuType: ""
  });

  const restaurantId = JSON.parse(sessionStorage.getItem("user-data")).state.restaurant?._id;

  useEffect(() => {
    if (restaurantId) {
      fetchMenus();
    }
  }, [restaurantId]);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://gebeta-delivery1.onrender.com/api/v1/food-menus?restaurantId=${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setMenus(data.data);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuFoods = async (menuId) => {
    setLoadingFoods(true);
    try {
      const res = await fetch(
        `https://gebeta-delivery1.onrender.com/api/v1/foods/by-menu/${menuId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        setMenuFoods(data.data.foods || []);
      } else {
        console.error('Failed to fetch foods:', data.message);
        setMenuFoods([]);
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      setMenuFoods([]);
    } finally {
      setLoadingFoods(false);
    }
  };

  const handleMenuClick = async (menu) => {
    setSelectedMenu(menu);
    await fetchMenuFoods(menu._id);
  };

  const handleEditMenu = async () => {
    if (!menuForm.menuType.trim()) return alert("Menu type is required");

    try {
      const payload = {
        menuType: menuForm.menuType.trim(),
      };

      const res = await fetch(
        `https://gebeta-delivery1.onrender.com/api/v1/food-menus/${editingMenu}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();
      if (res.ok) {
        await fetchMenus();
        setMenuForm({ menuType: "" });
        setEditingMenu(null);
        alert("Menu item updated successfully!");
      } else {
        alert(data.message || "Failed to update menu item");
      }
    } catch (error) {
      console.error("Error editing menu:", error);
      alert("Error updating menu item. Please try again.");
    }
  };

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    if (!menuForm.menuType.trim()) return alert("Menu type is required");

    try {
      const payload = {
        restaurantId: restaurantId,
        menuType: menuForm.menuType.trim(),
      };

      const res = await fetch("https://gebeta-delivery1.onrender.com/api/v1/food-menus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        await fetchMenus();
        setMenuForm({ menuType: "" });
        setShowAddMenu(false);
        alert("Menu created successfully!");
      } else {
        alert(data.message || "Failed to create menu");
      }
    } catch (error) {
      console.error("Error creating menu:", error);
      alert("Error creating menu. Please try again.");
    }
  };

  return (
    <>
    {showAddMenu && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 motion-scale-in-[0.31] motion-translate-x-in-[65%] motion-translate-y-in-[-41%]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#4b382a]">Add Menu</h3>
            <button 
              className="rounded-full hover:bg-red-50 transform transition-all duration-300" 
              onClick={() => setShowAddMenu(false)}
            >
              <X size={28} color="red" />
            </button>
          </div>
          
          <form onSubmit={handleCreateMenu} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4b382a] mb-1">
                Menu Type *
              </label>
              <input
                type="text"
                value={menuForm.menuType}
                onChange={(e) => setMenuForm({ menuType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4b382a]"
                placeholder="e.g., Lunch, Dinner, Breakfast"
                required
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMenu(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#905618] text-white py-2 px-4 rounded-md hover:bg-[#3d2e22] transition-colors"
              >
                Create Menu
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    {showAddFood &&(
      <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50  ">
        <div className="bg-white rounded-lg p-6 max-w-[700px] motion-scale-in-[0.31] motion-translate-x-in-[65%] motion-translate-y-in-[-41%]">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#4b382a]">Add Food Item</h3>
            <button className="rounded-full hover:bg-red-50 transform transition-all duration-300" onClick={() => setShowAddFood(false)}>
              <X size={28} color="red" />
            </button>
          </div>
          <AddMenu menuId={selectedMenu?._id} />
        </div>
      </div>
      </>
      )}
      <div className="p-6 bg-[#f4f1e9] min-h-[calc(100vh-65px)] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {selectedMenu && (
              <button
                onClick={() => {
                  setSelectedMenu(null);
                  setMenuFoods([]);
                }}
                className="text-[#4b382a] hover:text-[#3d2e22] p-1"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <h2 className="text-3xl font-bold text-[#4b382a]">
              {selectedMenu ? `${selectedMenu.menuType} - Foods` : 'Menu Management'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
          <button
            className={`bg-[#905618] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#3d2e22] transition-colors motion-preset-focus  duration-300  ${selectedMenu ? "" : "hidden"}`}
            onClick={() => setShowAddFood(true)}
          >
           <Salad size={18} />
            Add Food Item
          </button>
          <button
            className={`bg-[#905618] text-white px-4 py-2 rounded-lg flex items-center gap-2  transition-all duration-200 shadow-md hover:shadow-lg transform  motion-preset-focus  ${!selectedMenu ? "" : "hidden"}`}
            onClick={() => setShowAddMenu(true)}
          >
            <ChefHat size={18} />
            Add Menu
          </button>
          </div>
        </div>

        {editingMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#4b382a]">Edit Menu</h3>
                <button
                  onClick={() => {
                    setEditingMenu(null);
                    setMenuForm({ menuType: "" });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4b382a] mb-2">
                    Menu Type
                  </label>
                  <input
                    type="text"
                    value={menuForm.menuType}
                    onChange={(e) => setMenuForm({ ...menuForm, menuType: e.target.value })}
                    className="w-full p-3 border border-[#e0cda9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b382a]"
                    placeholder="Enter menu type (e.g., Breakfast, Lunch, Dinner)"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleEditMenu}
                  className="flex-1 bg-[#4b382a] text-white py-2 px-4 rounded-lg hover:bg-[#3d2e22] transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditingMenu(null);
                    setMenuForm({ menuType: "" });
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedMenu ? (
          <div>
            <h3 className="text-2xl font-semibold text-[#4b382a] mb-4 flex items-center gap-2">
              <ChefHat size={24} />
              Foods ({menuFoods.length})
            </h3>
            {loadingFoods ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b382a]"></div>
                <p className="mt-2 text-[#4b382a]">Loading foods...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {menuFoods.length > 0 ? (
                  menuFoods.map((food) => (
                    <div
                      key={food._id}
                      className="bg-white rounded-lg p-4 shadow-md border border-[#e0cda9]"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-lg font-bold text-[#a95b23]">{food.foodName}</p>
                          {food.instructions && (
                            <p className="text-gray-600 text-sm mt-1">{food.instructions}</p>
                          )}
                          <p className="text-[#4b382a] font-bold text-lg mt-2">{food.price} ETB</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${food.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {food.status}
                            </span>
                            {food.categoryId && (
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {food.categoryId.categoryName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuForm({
                                menuType: food.menuType || ""
                              });
                              setEditingMenu(food._id);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {food.image && (
                        <div className="mt-3">
                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No foods found in this menu</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-semibold text-[#4b382a] mb-4 flex items-center gap-2">
              <ChefHat size={24} />
              Menu Items ({menus.length})
            </h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b382a]"></div>
                <p className="mt-2 text-[#4b382a]">Loading menus...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {menus.map((menu) => (
                  <div
                    key={menu._id}
                    className="bg-white rounded-lg p-4 shadow-md border border-[#e0cda9] cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleMenuClick(menu)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="text-lg font-bold text-[#a95b23]">{menu.menuType}</p>
                        {menu.description && (
                          <p className="text-gray-600 text-sm mt-1">{menu.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${menu.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {menu.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuForm({
                              menuType: menu.menuType || ""
                            });
                            setEditingMenu(menu._id);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {menu.image && (
                      <div className="mt-3">
                        <img
                          src={menu.image}
                          alt={menu.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>);
};

export default Menus;
