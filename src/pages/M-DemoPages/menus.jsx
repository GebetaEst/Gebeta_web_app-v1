import React, { useState, useEffect } from 'react'
import {
  Pencil,
  Trash2,
  Search,
  Utensils,
  DollarSign,
  Image as ImageIcon,
  FileText,
  ToggleLeft,
  ToggleRight,
  Bell,
  RefreshCw,
  FolderPlus,
  FolderOpen,
  Plus,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = 'https://gebeta-delivery1.onrender.com/api/v1'
const API_ENDPOINTS = {
  GET_MENU: '/menu',
  CREATE_MENU: '/menu',
  UPDATE_MENU: '/menu',
  DELETE_MENU: '/menu',
  GET_CATEGORIES: '/food-categories',
  CREATE_CATEGORY: '/food-categories',
  UPDATE_CATEGORY: '/food-categories',
  DELETE_CATEGORY: '/food-categories',
}

// ============================================================================
// DEMO DATA
// ============================================================================

const initialFoods = [
  {
    id: 1,
    name: 'Pizza Margherita',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil.',
    category: 'Main Dishes',
  },
  {
    id: 2,
    name: 'Cheeseburger',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
    description: 'Juicy beef patty, cheddar cheese, lettuce, tomato, and onion.',
    category: 'Main Dishes',
  },
  {
    id: 3,
    name: 'Chicken Alfredo Pasta',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    description: 'Creamy Alfredo sauce with grilled chicken and fettuccine.',
    category: 'Main Dishes',
  },
  {
    id: 4,
    name: 'Vegan Salad Bowl',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    description: 'Fresh greens, avocado, cherry tomatoes, and vinaigrette.',
    category: 'Appetizers',
  },
  {
    id: 5,
    name: 'Grilled Salmon',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
    description: 'Salmon fillet grilled to perfection with lemon and herbs.',
    category: 'Main Dishes',
  },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const apiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers, ...options })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

const showBrowserNotification = (title, message) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: message,
      icon: '/src/assets/logo.svg',
      badge: '/src/assets/logo.svg',
      tag: 'menu-notification',
      requireInteraction: false,
      silent: true,
    })
    setTimeout(() => notification.close(), 4000)
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Menus = () => {
  // Data States
  const [foods, setFoods] = useState(initialFoods)
  const [categories, setCategories] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])

  // Modal States
  const [editFood, setEditFood] = useState(null)
  const [editCategory, setEditCategory] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null })

  // Form States
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [categoryForm, setCategoryForm] = useState({ categoryName: '', description: '' })
  const [createForm, setCreateForm] = useState({
    name: '', price: '', status: 'active', description: '', image: '', categoryId: ''
  })
  const [createCategoryForm, setCreateCategoryForm] = useState({
    categoryName: '', description: '', isActive: true
  })

  // Search States
  const [search, setSearch] = useState('')
  const [categorySearch, setCategorySearch] = useState('')

  // UI States
  const [statusDropdowns, setStatusDropdowns] = useState({})
  const [activeAccordion, setActiveAccordion] = useState('menu-items')
  const [loading, setLoading] = useState(false)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })
  const [notificationPermission, setNotificationPermission] = useState('default')

  // Form Validation States
  const [createErrors, setCreateErrors] = useState({})
  const [createCategoryErrors, setCreateCategoryErrors] = useState({})
  const [createTouched, setCreateTouched] = useState({})
  const [createCategoryTouched, setCreateCategoryTouched] = useState({})

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => showBrowserNotification(type === 'success' ? 'Success!' : 'Error!', message), 100)
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000)
  }

  const validateCreateForm = () => {
    const errors = {}
    if (!createForm.name.trim()) errors.name = 'Dish name is required.'
    if (!createForm.price || isNaN(Number(createForm.price)) || Number(createForm.price) <= 0) 
      errors.price = 'Valid price is required.'
    if (!createForm.categoryId.trim()) errors.categoryId = 'Category is required.'
    if (!createForm.description.trim()) errors.description = 'Description is required.'
    if (!createForm.image.trim() || !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(createForm.image.trim()))
      errors.image = 'Valid image URL is required.'
    return errors
  }

  const validateCreateCategoryForm = () => {
    const errors = {}
    if (!createCategoryForm.categoryName.trim()) errors.categoryName = 'Category name is required.'
    if (!createCategoryForm.description.trim()) errors.description = 'Description is required.'
    return errors
  }

  const getCategoryId = (category) => category._id || category.id
  const getCategoryDisplayId = (id) => id.length >= 4 ? id.slice(-4) : id

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  const fetchCategoryData = async () => {
    try {
      setCategoryLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        setCategories([])
        return
      }
      const data = await apiCall(API_ENDPOINTS.GET_CATEGORIES)
      setCategories(data.data || data || [])
    } catch (error) {
      showNotification('error', 'Failed to load category data.')
      setCategories([])
    } finally {
      setCategoryLoading(false)
    }
  }

  const fetchAvailableCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setAvailableCategories([])
        return
      }
      const data = await apiCall(API_ENDPOINTS.GET_CATEGORIES)
      setAvailableCategories((data.data || data || []).filter(cat => cat.isActive))
    } catch (error) {
      setAvailableCategories([])
    }
  }

  const createCategory = async (categoryData) => {
    setCategoryLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token found. Please log in.')
      const response = await apiCall(API_ENDPOINTS.CREATE_CATEGORY, {
        method: 'POST',
        body: JSON.stringify(categoryData),
      })
      return { success: true, data: response.data || response }
    } finally {
      setCategoryLoading(false)
    }
  }

  const updateCategory = async (id, categoryData) => {
    setCategoryLoading(true)
    try {
      const response = await apiCall(`${API_ENDPOINTS.UPDATE_CATEGORY}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(categoryData),
      })
      return { success: true, data: response.data || response }
    } finally {
      setCategoryLoading(false)
    }
  }

  const toggleCategoryStatus = async (id, isActive) => {
    setCategoryLoading(true)
    try {
      const response = await apiCall(`${API_ENDPOINTS.UPDATE_CATEGORY}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !isActive }),
      })
      return { success: true, data: response.data || response }
    } finally {
      setCategoryLoading(false)
    }
  }

  const refreshTableData = async () => {
    setRefreshing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      showNotification('success', 'Table data refreshed successfully.')
    } catch (error) {
      showNotification('error', 'Failed to refresh table data.')
    } finally {
      setRefreshing(false)
    }
  }

  const updateItemStatus = async (id, newStatus) => {
    try {
      setFoods(prev => prev.map(food => food.id === id ? { ...food, status: newStatus } : food))
      showNotification('success', `Menu item status updated to ${newStatus}.`)
      setStatusDropdowns(prev => ({ ...prev, [id]: false }))
    } catch (error) {
      showNotification('error', 'Failed to update menu item status.')
    }
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleDelete = (id) => setDeleteConfirm({ open: true, id })

  const confirmDelete = () => {
    const { id } = deleteConfirm
    setDeleteConfirm({ open: false, id: null })
    if (id && foods.some(food => food.id === id)) {
      setFoods(foods.filter(food => food.id !== id))
      showNotification('success', 'Menu item deleted successfully.')
    } else {
      showNotification('error', 'Failed to delete menu item.')
    }
  }

  const handleEdit = (food) => {
    setEditFood(food)
    setForm({ name: food.name, description: food.description, image: food.image })
    setModalOpen(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setFoods(foods.map(food => food.id === editFood.id ? { ...editFood, ...form } : food))
    showNotification('success', 'Menu item updated successfully.')
    setModalOpen(false)
    setEditFood(null)
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    const errors = validateCreateForm()
    setCreateErrors(errors)
    setCreateTouched({ name: true, price: true, categoryId: true, description: true, image: true })

    if (Object.keys(errors).length === 0) {
      const newMenuItem = {
        id: Date.now(),
        ...createForm,
        category: availableCategories.find(cat => getCategoryId(cat) === createForm.categoryId)?.categoryName || 'Unknown Category',
      }
      setFoods(prev => [...prev, newMenuItem])
      showNotification('success', 'Menu item created successfully.')
      setCreateModalOpen(false)
      setCreateForm({ name: '', price: '', status: 'active', description: '', image: '', categoryId: '' })
      setCreateErrors({})
      setCreateTouched({})
    }
  }

  const handleCategoryStatusToggle = async (id, isActive) => {
    try {
      const result = await toggleCategoryStatus(id, isActive)
      if (result.success) {
        setCategories(categories.map(category => 
          getCategoryId(category) === id ? { ...category, isActive: !isActive } : category
        ))
        fetchAvailableCategories()
        showNotification('success', `Category ${!isActive ? 'activated' : 'deactivated'} successfully.`)
      }
    } catch (error) {
      showNotification('error', `Failed to ${isActive ? 'deactivate' : 'activate'} category.`)
    }
  }

  const handleCategoryEdit = (category) => {
    setEditCategory(category)
    setCategoryForm({ categoryName: category.categoryName, description: category.description })
    setCategoryModalOpen(true)
  }

  const handleCategoryUpdate = async (e) => {
    e.preventDefault()
    try {
      const result = await updateCategory(getCategoryId(editCategory), categoryForm)
      if (result.success) {
        setCategories(categories.map(category => 
          getCategoryId(category) === getCategoryId(editCategory) ? result.data : category
        ))
        showNotification('success', 'Category updated successfully.')
      }
    } catch (error) {
      showNotification('error', 'Failed to update category.')
    }
    setCategoryModalOpen(false)
    setEditCategory(null)
  }

  const handleCreateCategorySubmit = async (e) => {
    e.preventDefault()
    const errors = validateCreateCategoryForm()
    setCreateCategoryErrors(errors)
    setCreateCategoryTouched({ categoryName: true, description: true })

    if (Object.keys(errors).length === 0) {
      try {
        const result = await createCategory(createCategoryForm)
        if (result.success) {
          setCategories(prev => [...prev, result.data])
          fetchAvailableCategories()
          showNotification('success', 'Category created successfully.')
        }
      } catch (error) {
        const errorMessage = error.message === 'No authentication token found. Please log in.'
          ? 'Please log in to create categories.'
          : 'Failed to create category. Please try again.'
        showNotification('error', errorMessage)
      }
      setCreateCategoryModalOpen(false)
      setCreateCategoryForm({ categoryName: '', description: '', isActive: true })
      setCreateCategoryErrors({})
      setCreateCategoryTouched({})
    }
  }

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window) {
        const permission = Notification.permission === 'default' 
          ? await Notification.requestPermission() 
          : Notification.permission
        setNotificationPermission(permission)
      }
    }
    requestNotificationPermission()
  }, [])

  useEffect(() => {
    fetchCategoryData()
    fetchAvailableCategories()
    const token = localStorage.getItem('token')
    if (!token) showNotification('error', 'Please log in to manage categories.')
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.status-dropdown')) setStatusDropdowns({})
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ============================================================================
  // FILTERED DATA
  // ============================================================================

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(search.toLowerCase()) ||
    food.description.toLowerCase().includes(search.toLowerCase())
  )

  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(categorySearch.toLowerCase()) ||
    category.description.toLowerCase().includes(categorySearch.toLowerCase())
  )

  return (
    <div
      className='rounded-lg shadow-2xl bg-white w-full h-[calc(100vh-65px)] my-8 mx-auto p-6 overflow-y-auto'
      style={{ maxWidth: '110rem' }}
    >
      {/* Loading Indicator */}
      {loading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]'>
          <div className='bg-white rounded-lg p-6 shadow-xl'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto'></div>
            <p className='mt-2 text-gray-600'>Loading...</p>
          </div>
        </div>
      )}

      {/* Accordion Container */}
      <div className='space-y-4'>
        {/* Menu Items Accordion */}
        <div className='border border-gray-200 rounded-lg overflow-hidden'>
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'menu-items' ? null : 'menu-items')}
            className='w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left'
          >
            <div className='flex items-center gap-3'>
              <Utensils className='w-5 h-5 text-orange-600' />
              <h2 className='text-xl font-bold text-gray-800'>Menu Items</h2>
            </div>
            {activeAccordion === 'menu-items' ? (
              <ChevronDown className='w-5 h-5 text-gray-600' />
            ) : (
              <ChevronRight className='w-5 h-5 text-gray-600' />
            )}
          </button>

          {activeAccordion === 'menu-items' && (
            <div className='p-6 border-t border-gray-200'>
              <h1 className='text-xl font-bold mb-4 text-black'>Food Menu</h1>
              
              {/* Search Bar and Create Button */}
              <div className='flex items-center justify-between mb-6 w-full mx-auto' style={{ maxWidth: '110rem' }}>
                <div className='relative w-full max-w-md'>
                  <span className='absolute left-3 top-2.5 text-gray-400'>
                    <Search size={20} />
                  </span>
                  <input
                    type='text'
                    placeholder='Search food by name or description...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-black focus:outline-none text-lg bg-white'
                  />
                </div>
                <div className='w-full max-w-md flex justify-end'>
                  <button
                    onClick={refreshTableData}
                    disabled={refreshing}
                    className='mr-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg shadow font-semibold text-base transform hover:scale-105 duration-150 disabled:transform-none'
                  >
                    <RefreshCw size={18} className={`${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow font-semibold text-base transform hover:scale-105 duration-150'
                  >
                    + Create Menu Item
                  </button>
                </div>
              </div>

              {/* Menu Items Table */}
              <div className='overflow-x-auto' style={{ maxWidth: '110rem' }}>
                <table className='table-auto w-full rounded-lg border-separate' style={{ borderSpacing: 0 }}>
                  <thead>
                    <tr>
                      {['No.', 'Image', 'Name', 'Category', 'Status', 'Description', 'Actions'].map(header => (
                        <th key={header} className='px-4 py-2 text-left text-gray-700 font-medium' style={{ border: '1px solid #C0C0C0' }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFoods.length === 0 && (
                      <tr>
                        <td colSpan={7} className='text-center text-gray-500 py-8' style={{ border: '1px solid #C0C0C0' }}>
                          No food items found.
                        </td>
                      </tr>
                    )}
                    {filteredFoods.map((food) => (
                      <tr key={food.id} className='hover:bg-gray-50 transition'>
                        <td className='px-4 py-2 font-mono font-bold text-black align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          <span className='text-gray-400'>#</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(food.id.toString())
                              showNotification('success', `ID ${food.id} copied to clipboard!`)
                            }}
                            className='text-blue-600 hover:text-blue-800 underline cursor-pointer font-bold'
                            title={`Click to copy full ID: ${food.id}`}
                          >
                            {getCategoryDisplayId(food.id.toString())}
                          </button>
                        </td>
                        <td className='px-4 py-2 align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          <img src={food.image} alt={food.name} className='w-16 h-16 object-cover rounded-lg shadow' />
                        </td>
                        <td className='px-4 py-2 font-semibold text-lg text-black align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          {food.name}
                        </td>
                        <td className='px-4 py-2 align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800'>
                            {food.category || 'No Category'}
                          </span>
                        </td>
                        <td className='px-4 py-2 align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          <div className='relative status-dropdown'>
                            <button
                              onClick={() => setStatusDropdowns(prev => ({ ...prev, [food.id]: !prev[food.id] }))}
                              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                food.status === 'inactive'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {food.status ? food.status.charAt(0).toUpperCase() + food.status.slice(1) : 'Active'}
                              <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                              </svg>
                            </button>

                            {statusDropdowns[food.id] && (
                              <div className='absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[120px]'>
                                <div className='py-1'>
                                  {['active', 'inactive'].map(status => (
                                    <button
                                      key={status}
                                      onClick={() => updateItemStatus(food.id, status)}
                                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                        food.status === status
                                          ? `bg-${status === 'active' ? 'green' : 'red'}-50 text-${status === 'active' ? 'green' : 'red'}-700 font-semibold`
                                          : 'text-gray-700'
                                      }`}
                                    >
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className='px-4 py-2 text-gray-700 align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          {food.description}
                        </td>
                        <td className='px-4 py-2 align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          <div className='flex gap-2'>
                            <button
                              onClick={() => handleEdit(food)}
                              className='flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow transition font-semibold text-base transform hover:scale-105 duration-150'
                            >
                              <Pencil size={16} /> Update
                            </button>
                            <button
                              onClick={() => handleDelete(food.id)}
                              className='flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition font-semibold text-base transform hover:scale-105 duration-150'
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Menu Categories Accordion */}
        <div className='border border-gray-200 rounded-lg overflow-hidden'>
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'menu-categories' ? null : 'menu-categories')}
            className='w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left'
          >
            <div className='flex items-center gap-3'>
              <FolderOpen className='w-5 h-5 text-blue-600' />
              <h2 className='text-xl font-bold text-gray-800'>Menu Categories</h2>
            </div>
            {activeAccordion === 'menu-categories' ? (
              <ChevronDown className='w-5 h-5 text-gray-600' />
            ) : (
              <ChevronRight className='w-5 h-5 text-gray-600' />
            )}
          </button>

          {activeAccordion === 'menu-categories' && (
            <div className='p-6 border-t border-gray-200'>
              <div className='flex items-center gap-2 mb-6'>
                <FolderOpen className='w-6 h-6 text-blue-600' />
                <h2 className='text-xl font-bold text-black'>Menu Categories</h2>
                {categoryLoading && (
                  <div className='flex items-center gap-2 ml-4'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
                    <span className='text-sm text-gray-600'>Loading...</span>
                  </div>
                )}
              </div>

              {/* Category Search and Create Button */}
              <div className='flex items-center justify-between mb-6'>
                <div className='relative w-full max-w-md'>
                  <span className='absolute left-3 top-2.5 text-gray-400'>
                    <Search size={20} />
                  </span>
                  <input
                    type='text'
                    placeholder='Search categories...'
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className='pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg bg-white'
                  />
                </div>
                <div className='w-full max-w-md flex justify-end'>
                  <button
                    onClick={() => setCreateCategoryModalOpen(true)}
                    disabled={categoryLoading}
                    className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg shadow font-semibold text-base transform hover:scale-105 duration-150 flex items-center gap-2 disabled:transform-none'
                  >
                    {categoryLoading ? (
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    ) : (
                      <FolderPlus size={18} />
                    )}
                    + Create Category
                  </button>
                </div>
              </div>

              {/* Categories Table */}
              <div className='overflow-x-auto'>
                <table className='table-auto w-full rounded-lg border-separate' style={{ borderSpacing: 0 }}>
                  <thead>
                    <tr>
                      {['No.', 'Category Name', 'Description', 'Status', 'Actions'].map(header => (
                        <th key={header} className='px-4 py-2 text-left text-gray-700 font-medium' style={{ border: '1px solid #C0C0C0' }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.length === 0 && (
                      <tr>
                        <td colSpan={5} className='text-center text-gray-500 py-8' style={{ border: '1px solid #C0C0C0' }}>
                          {categories.length === 0 ? 'No category data found.' : 'No categories match your search.'}
                        </td>
                      </tr>
                    )}
                    {filteredCategories.map((category) => (
                      <tr key={getCategoryId(category)} className='hover:bg-gray-50 transition'>
                        <td className='px-4 py-2 font-mono font-bold text-black align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          <span className='text-gray-400'>#</span>
                          <button
                            onClick={() => {
                              const categoryId = getCategoryId(category)
                              navigator.clipboard.writeText(categoryId)
                              showNotification('success', `Category ID ${categoryId} copied to clipboard!`)
                            }}
                            className='text-blue-600 hover:text-blue-800 underline cursor-pointer font-bold'
                            title={`Click to copy full Category ID: ${getCategoryId(category)}`}
                          >
                            {getCategoryDisplayId(getCategoryId(category))}
                          </button>
                        </td>
                        <td className='px-4 py-2 font-semibold text-lg text-black align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          {category.categoryName}
                        </td>
                        <td className='px-4 py-2 text-gray-700 align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          {category.description}
                        </td>
                        <td className='px-4 py-2 align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className='px-4 py-2 align-middle' style={{ border: '1px solid #C0C0C0' }}>
                          <div className='flex gap-2'>
                            <button
                              onClick={() => handleCategoryEdit(category)}
                              disabled={categoryLoading}
                              className='flex items-center gap-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white px-4 py-2 rounded-lg shadow transition font-semibold text-base transform hover:scale-105 duration-150 disabled:transform-none'
                            >
                              {categoryLoading ? (
                                <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-white'></div>
                              ) : (
                                <Pencil size={16} />
                              )}
                              Edit
                            </button>
                            <button
                              onClick={() => handleCategoryStatusToggle(getCategoryId(category), category.isActive)}
                              disabled={categoryLoading}
                              className={`flex items-center gap-1 px-4 py-2 rounded-lg shadow transition font-semibold text-base transform hover:scale-105 duration-150 disabled:transform-none ${
                                category.isActive
                                  ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white'
                                  : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white'
                              }`}
                            >
                              {categoryLoading ? (
                                <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-white'></div>
                              ) : category.isActive ? (
                                <Trash2 size={16} />
                              ) : (
                                <Plus size={16} />
                              )}
                              {category.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Update Menu Item Modal */}
      {modalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fade-in'>
            <button
              className='absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold'
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h2 className='text-xl font-bold mb-4 text-black'>Update Food Item</h2>
            <form onSubmit={handleUpdate} className='space-y-4'>
              {[
                { name: 'name', label: 'Name', type: 'input' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'image', label: 'Image URL', type: 'input' }
              ].map(field => (
                <div key={field.name}>
                  <label className='block text-sm font-medium mb-1'>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={form[field.name]}
                      onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                      className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
                      required
                    />
                  ) : (
                    <input
                      type='text'
                      name={field.name}
                      value={form[field.name]}
                      onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                      className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
                      required
                    />
                  )}
                </div>
              ))}
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setModalOpen(false)}
                  className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 shadow'
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Menu Item Modal */}
      {createModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fade-in'>
            <button
              className='absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold'
              onClick={() => setCreateModalOpen(false)}
            >
              &times;
            </button>
            <h2 className='text-xl font-bold mb-4 text-black'>Create Menu Item</h2>
            <form className='space-y-6' onSubmit={handleCreateSubmit} noValidate>
              {/* Dish Name */}
              <div>
                <label className='block mb-1 text-sm font-semibold text-gray-700'>
                  <span className='inline-flex items-center gap-1'>
                    <Utensils size={18} className='text-gray-500' /> Dish Name
                  </span>
                </label>
                <input
                  type='text'
                  name='name'
                  value={createForm.name}
                  onChange={(e) => {
                    setCreateForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
                    setCreateTouched(prev => ({ ...prev, [e.target.name]: true }))
                  }}
                  onBlur={() => {
                    setCreateTouched(prev => ({ ...prev, name: true }))
                    setCreateErrors(validateCreateForm())
                  }}
                  className={`w-full border ${
                    createErrors.name && createTouched.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black`}
                  autoComplete='off'
                />
                {createErrors.name && createTouched.name && (
                  <span className='text-xs text-red-500 mt-1 block'>{createErrors.name}</span>
                )}
              </div>
              
              {/* Price */}
              <div>
                <label className='block mb-1 text-sm font-semibold text-gray-700'>
                  <span className='inline-flex items-center gap-1'>
                    <DollarSign size={18} className='text-gray-500' /> Price
                  </span>
                </label>
                <input
                  type='number'
                  name='price'
                  value={createForm.price}
                  onChange={(e) => {
                    setCreateForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
                    setCreateTouched(prev => ({ ...prev, [e.target.name]: true }))
                  }}
                  onBlur={() => {
                    setCreateTouched(prev => ({ ...prev, price: true }))
                    setCreateErrors(validateCreateForm())
                  }}
                  className={`w-full border ${
                    createErrors.price && createTouched.price ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black`}
                  min='0'
                  step='0.01'
                  autoComplete='off'
                />
                {createErrors.price && createTouched.price && (
                  <span className='text-xs text-red-500 mt-1 block'>{createErrors.price}</span>
                )}
              </div>

              {/* Category */}
              <div>
                <label className='block mb-1 text-sm font-semibold text-gray-700'>
                  <span className='inline-flex items-center gap-1'>
                    <FolderOpen size={18} className='text-gray-500' /> Category
                  </span>
                </label>
                <select
                  name='categoryId'
                  value={createForm.categoryId}
                  onChange={(e) => {
                    setCreateForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
                    setCreateTouched(prev => ({ ...prev, [e.target.name]: true }))
                  }}
                  onBlur={() => {
                    setCreateTouched(prev => ({ ...prev, categoryId: true }))
                    setCreateErrors(validateCreateForm())
                  }}
                  className={`w-full border ${
                    createErrors.categoryId && createTouched.categoryId ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black bg-white`}
                  autoComplete='off'
                >
                  <option value=''>Select a category</option>
                  {availableCategories.map((category) => (
                    <option key={getCategoryId(category)} value={getCategoryId(category)}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {createErrors.categoryId && createTouched.categoryId && (
                  <span className='text-xs text-red-500 mt-1 block'>{createErrors.categoryId}</span>
                )}
                {availableCategories.length === 0 && (
                  <span className='text-xs text-orange-500 mt-1 block'>
                    No category data found. Please create a category first.
                  </span>
                )}
              </div>
              
              {/* Status */}
              <div className='flex items-center gap-2'>
                {createForm.status === 'active' ? (
                  <ToggleRight
                    size={24}
                    className='text-green-500 cursor-pointer'
                    onClick={() => setCreateForm(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))}
                  />
                ) : (
                  <ToggleLeft
                    size={24}
                    className='text-gray-400 cursor-pointer'
                    onClick={() => setCreateForm(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))}
                  />
                )}
                <span className={`font-semibold ${createForm.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                  {createForm.status.charAt(0).toUpperCase() + createForm.status.slice(1)}
                </span>
              </div>
              
              {/* Description */}
              <div>
                <label className='block mb-1 text-sm font-semibold text-gray-700'>
                  <span className='inline-flex items-center gap-1'>
                    <FileText size={18} className='text-gray-500' /> Description
                  </span>
                </label>
                <textarea
                  name='description'
                  value={createForm.description}
                  onChange={(e) => {
                    setCreateForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
                    setCreateTouched(prev => ({ ...prev, [e.target.name]: true }))
                  }}
                  onBlur={() => {
                    setCreateTouched(prev => ({ ...prev, description: true }))
                    setCreateErrors(validateCreateForm())
                  }}
                  className={`w-full border ${
                    createErrors.description && createTouched.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black`}
                  rows={3}
                  autoComplete='off'
                />
                {createErrors.description && createTouched.description && (
                  <span className='text-xs text-red-500 mt-1 block'>{createErrors.description}</span>
                )}
              </div>
              
              {/* Image URL */}
              <div>
                <label className='block mb-1 text-sm font-semibold text-gray-700'>
                  <span className='inline-flex items-center gap-1'>
                    <ImageIcon size={18} className='text-gray-500' /> Image URL
                  </span>
                </label>
                <input
                  type='text'
                  name='image'
                  value={createForm.image}
                  onChange={(e) => {
                    setCreateForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
                    setCreateTouched(prev => ({ ...prev, [e.target.name]: true }))
                  }}
                  onBlur={() => {
                    setCreateTouched(prev => ({ ...prev, image: true }))
                    setCreateErrors(validateCreateForm())
                  }}
                  className={`w-full border ${
                    createErrors.image && createTouched.image ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black`}
                  autoComplete='off'
                />
                {createErrors.image && createTouched.image && (
                  <span className='text-xs text-red-500 mt-1 block'>{createErrors.image}</span>
                )}
              </div>
              
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setCreateModalOpen(false)}
                  className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow disabled:opacity-50'
                  disabled={Object.keys(validateCreateForm()).length > 0}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-xs relative animate-fade-in'>
            <h2 className='text-lg font-bold mb-4 text-black text-center'>
              Are you sure you want to delete this menu item?
            </h2>
            <div className='flex justify-center gap-4 mt-6'>
              <button
                onClick={confirmDelete}
                className='px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow transition'
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteConfirm({ open: false, id: null })}
                className='px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold shadow transition'
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Category Modal */}
      {categoryModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fade-in'>
            <button
              className='absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold'
              onClick={() => setCategoryModalOpen(false)}
            >
              &times;
            </button>
            <h2 className='text-xl font-bold mb-4 text-black flex items-center gap-2'>
              <FolderOpen className='w-5 h-5 text-blue-600' />
              Update Category
            </h2>
            <form onSubmit={handleCategoryUpdate} className='space-y-4'>
              {[
                { name: 'categoryName', label: 'Category Name' },
                { name: 'description', label: 'Description' }
              ].map(field => (
                <div key={field.name}>
                  <label className='block text-sm font-medium mb-1'>{field.label}</label>
                  {field.name === 'description' ? (
                    <textarea
                      name={field.name}
                      value={categoryForm[field.name]}
                      onChange={(e) => setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value })}
                      className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      rows={3}
                      required
                    />
                  ) : (
                    <input
                      type='text'
                      name={field.name}
                      value={categoryForm[field.name]}
                      onChange={(e) => setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value })}
                      className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  )}
                </div>
              ))}
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setCategoryModalOpen(false)}
                  className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={categoryLoading}
                  className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow disabled:opacity-50 flex items-center gap-2'
                >
                  {categoryLoading && <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {createCategoryModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fade-in'>
            <button
              className='absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold'
              onClick={() => setCreateCategoryModalOpen(false)}
            >
              &times;
            </button>
            <h2 className='text-xl font-bold mb-4 text-black flex items-center gap-2'>
              <FolderPlus className='w-5 h-5 text-blue-600' />
              Create Category
            </h2>
            <form className='space-y-6' onSubmit={handleCreateCategorySubmit} noValidate>
              {/* Category Name */}
              <div>
                <label className='block mb-1 text-sm font-semibold text-gray-700'>
                  <span className='inline-flex items-center gap-1'>
                    <FolderOpen size={18} className='text-gray-500' /> Category Name
                  </span>
                </label>
                <input
                  type='text'
                  name='categoryName'
                  value={createCategoryForm.categoryName}
                  onChange={(e) => {
                    setCreateCategoryForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
                    setCreateCategoryTouched(prev => ({ ...prev, [e.target.name]: true }))
                  }}
                  onBlur={() => {
                    setCreateCategoryTouched(prev => ({ ...prev, categoryName: true }))
                    setCreateCategoryErrors(validateCreateCategoryForm())
                  }}
                  className={`w-full border ${
                    createCategoryErrors.categoryName && createCategoryTouched.categoryName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  autoComplete='off'
                />
                {createCategoryErrors.categoryName && createCategoryTouched.categoryName && (
                  <span className='text-xs text-red-500 mt-1 block'>{createCategoryErrors.categoryName}</span>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label className='block mb-1 text-sm font-semibold text-gray-700'>
                  <span className='inline-flex items-center gap-1'>
                    <FileText size={18} className='text-gray-500' /> Description
                  </span>
                </label>
                <textarea
                  name='description'
                  value={createCategoryForm.description}
                  onChange={(e) => {
                    setCreateCategoryForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
                    setCreateCategoryTouched(prev => ({ ...prev, [e.target.name]: true }))
                  }}
                  onBlur={() => {
                    setCreateCategoryTouched(prev => ({ ...prev, description: true }))
                    setCreateCategoryErrors(validateCreateCategoryForm())
                  }}
                  className={`w-full border ${
                    createCategoryErrors.description && createCategoryTouched.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  rows={3}
                  autoComplete='off'
                />
                {createCategoryErrors.description && createCategoryTouched.description && (
                  <span className='text-xs text-red-500 mt-1 block'>{createCategoryErrors.description}</span>
                )}
              </div>

              {/* Status Toggle */}
              <div className='flex items-center gap-2'>
                {createCategoryForm.isActive ? (
                  <ToggleRight
                    size={24}
                    className='text-green-500 cursor-pointer'
                    onClick={() => setCreateCategoryForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                  />
                ) : (
                  <ToggleLeft
                    size={24}
                    className='text-gray-400 cursor-pointer'
                    onClick={() => setCreateCategoryForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                  />
                )}
                <span className={`font-semibold ${createCategoryForm.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {createCategoryForm.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setCreateCategoryModalOpen(false)}
                  className='px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={Object.keys(validateCreateCategoryForm()).length > 0 || categoryLoading}
                  className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow disabled:opacity-50 flex items-center gap-2'
                >
                  {categoryLoading && <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Permission Status */}
      {notificationPermission === 'default' && (
        <div className='fixed top-20 right-6 z-[100] px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-lg text-sm'>
          <div className='flex items-center gap-2'>
            <Bell className='w-4 h-4' />
            <span>Click to enable notifications</span>
          </div>
        </div>
      )}

      {notificationPermission === 'denied' && (
        <div className='fixed top-20 right-6 z-[100] px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg text-sm'>
          <div className='flex items-center gap-2'>
            <Bell className='w-4 h-4' />
            <span>Notifications blocked. Please enable in browser settings.</span>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-lg shadow-lg text-white text-lg font-semibold transition-all duration-500 ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } animate-fade-in flex items-center gap-3`}
          style={{ minWidth: '250px' }}
        >
          <Bell className={`w-6 h-6 animate-bounce ${notification.type === 'success' ? 'text-green-200' : 'text-red-200'}`} />
          {notification.message}
        </div>
      )}
    </div>
  )
}

export default Menus
