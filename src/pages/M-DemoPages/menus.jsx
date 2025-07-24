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

// ============================================================================
// API HELPER FUNCTIONS
// ============================================================================

/**
 * Generic API call function with authentication
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<object>} API response data
 */
const apiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
    }

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

/**
 * Demo food items for initial display
 * Used when API is not available or for testing
 */
const initialFoods = [
  {
    id: 1,
    name: 'Pizza Margherita',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil.',
    category: 'Main Dishes',
  },
  {
    id: 2,
    name: 'Cheeseburger',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
    description:
      'Juicy beef patty, cheddar cheese, lettuce, tomato, and onion.',
    category: 'Main Dishes',
  },
  {
    id: 3,
    name: 'Chicken Alfredo Pasta',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    description: 'Creamy Alfredo sauce with grilled chicken and fettuccine.',
    category: 'Main Dishes',
  },
  {
    id: 4,
    name: 'Vegan Salad Bowl',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    description: 'Fresh greens, avocado, cherry tomatoes, and vinaigrette.',
    category: 'Appetizers',
  },
  {
    id: 5,
    name: 'Grilled Salmon',
    image:
      'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
    description: 'Salmon fillet grilled to perfection with lemon and herbs.',
    category: 'Main Dishes',
  },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Menus = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Data States
  const [foods, setFoods] = useState(initialFoods)
  const [categories, setCategories] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])

  // Edit States
  const [editFood, setEditFood] = useState(null)
  const [editCategory, setEditCategory] = useState(null)

  // Modal States
  const [modalOpen, setModalOpen] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false)

  // Form States
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [categoryForm, setCategoryForm] = useState({
    categoryName: '',
    description: '',
  })
  const [createForm, setCreateForm] = useState({
    name: '',
    price: '',
    status: 'active',
    description: '',
    image: '',
    categoryId: '',
  })
  const [createCategoryForm, setCreateCategoryForm] = useState({
    categoryName: '',
    description: '',
    isActive: true,
  })

  // Search States
  const [search, setSearch] = useState('')
  const [categorySearch, setCategorySearch] = useState('')

  // UI States
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null })
  const [statusDropdowns, setStatusDropdowns] = useState({})
  const [activeAccordion, setActiveAccordion] = useState('menu-items')

  // Loading States
  const [loading, setLoading] = useState(false)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Notification States
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: '',
  })
  const [notificationPermission, setNotificationPermission] =
    useState('default')

  // Form Validation States
  const [createErrors, setCreateErrors] = useState({})
  const [createCategoryErrors, setCreateCategoryErrors] = useState({})
  const [createTouched, setCreateTouched] = useState({})
  const [createCategoryTouched, setCreateCategoryTouched] = useState({})

  // ============================================================================
  // NOTIFICATION FUNCTIONS
  // ============================================================================

  /**
   * Display notification with both in-app and browser notifications
   * @param {string} type - 'success' or 'error'
   * @param {string} message - Notification message
   */
  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    })

    // Show browser notification with delay
    setTimeout(() => {
      const title = type === 'success' ? 'Success!' : 'Error!'
      showBrowserNotification(title, message, type)
    }, 100)

    // Auto hide after 4 seconds
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' })
    }, 4000)
  }

  /**
   * Show browser system notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} type - Notification type
   */
  const showBrowserNotification = (title, message, type = 'info') => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: message,
        icon: '/src/assets/logo.svg',
        badge: '/src/assets/logo.svg',
        tag: 'menu-notification',
        requireInteraction: false,
        silent: true, // No system notification sound
      })

      // Auto close after 4 seconds
      setTimeout(() => {
        notification.close()
      }, 4000)
    }
  }

  // ============================================================================
  // EFFECTS & INITIALIZATION
  // ============================================================================

  /**
   * Request browser notification permission on component mount
   */
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window) {
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission()
          setNotificationPermission(permission)
        } else {
          setNotificationPermission(Notification.permission)
        }
      }
    }

    requestNotificationPermission()
  }, [])

  /**
   * Load initial data on component mount
   */
  useEffect(() => {
    fetchCategoryData()
    fetchAvailableCategories()
    console.log('Component mounted - fetching category data')

    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      showNotification('error', 'Please log in to manage categories.')
    }
  }, [])

  /**
   * Close status dropdowns when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.status-dropdown')) {
        setStatusDropdowns({})
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // ============================================================================
  // MENU ITEM FUNCTIONS
  // ============================================================================

  /**
   * Fetch menu data from API (currently using demo data)
   */
  const fetchMenuData = async () => {
    try {
      setLoading(true)
      // TODO: Implement actual API call
      // const data = await apiCall(API_ENDPOINTS.GET_MENU)
      // setFoods(data.menu || [])
      console.log('Fetching menu data from API...')
    } catch (error) {
      console.error('Failed to fetch menu data:', error)
      showNotification('error', 'Failed to load menu data.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Refresh table data with loading animation
   */
  const refreshTableData = async () => {
    try {
      setRefreshing(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // TODO: Implement actual API refresh
      // const data = await apiCall(API_ENDPOINTS.GET_MENU)
      // setFoods(data.menu || [])

      console.log('Table data refreshed successfully')
      showNotification('success', 'Table data refreshed successfully.')
    } catch (error) {
      console.error('Failed to refresh table data:', error)
      showNotification('error', 'Failed to refresh table data.')
    } finally {
      setRefreshing(false)
    }
  }

  // Create new menu item
  const createMenuItem = async (menuData) => {
    try {
      setLoading(true)
      // const response = await apiCall(API_ENDPOINTS.CREATE_MENU, {
      //   method: 'POST',
      //   body: JSON.stringify(menuData),
      // })
      // setFoods(prev => [...prev, response.menu])
      console.log('Creating menu item:', menuData)
      return { success: true }
    } catch (error) {
      console.error('Failed to create menu item:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update existing menu item
  const updateMenuItem = async (id, menuData) => {
    try {
      setLoading(true)
      // const response = await apiCall(`${API_ENDPOINTS.UPDATE_MENU}/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(menuData),
      // })
      // setFoods(prev => prev.map(food => food.id === id ? response.menu : food))
      console.log('Updating menu item:', id, menuData)
      return { success: true }
    } catch (error) {
      console.error('Failed to update menu item:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Delete menu item
  const deleteMenuItem = async (id) => {
    try {
      setLoading(true)
      // await apiCall(`${API_ENDPOINTS.DELETE_MENU}/${id}`, {
      //   method: 'DELETE',
      // })
      // setFoods(prev => prev.filter(food => food.id !== id))
      console.log('Deleting menu item:', id)
      return { success: true }
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Toggle status dropdown visibility
  const toggleStatusDropdown = (id) => {
    setStatusDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Update menu item status
  const updateItemStatus = async (id, newStatus) => {
    try {
      setLoading(true)
      // await apiCall(`${API_ENDPOINTS.UPDATE_MENU}/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: newStatus }),
      // })
      setFoods((prev) =>
        prev.map((food) =>
          food.id === id ? { ...food, status: newStatus } : food
        )
      )
      showNotification('success', `Menu item status updated to ${newStatus}.`)
      setStatusDropdowns((prev) => ({ ...prev, [id]: false }))
    } catch (error) {
      console.error('Failed to update status:', error)
      showNotification('error', 'Failed to update menu item status.')
    } finally {
      setLoading(false)
    }
  }

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.status-dropdown')) {
        setStatusDropdowns({})
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // ============================================================================
  // CATEGORY MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Fetch all categories from API
   */
  const fetchCategoryData = async () => {
    try {
      setCategoryLoading(true)
      const token = localStorage.getItem('token')

      if (!token) {
        console.warn('No authentication token found.')
        setCategories([])
        return
      }

      const data = await apiCall(API_ENDPOINTS.GET_CATEGORIES)
      setCategories(data.data || data || [])
      console.log('Category data fetched successfully:', data)
    } catch (error) {
      console.error('Failed to fetch category data:', error)
      showNotification('error', 'Failed to load category data.')
      setCategories([])
    } finally {
      setCategoryLoading(false)
    }
  }

  /**
   * Fetch only active categories for dropdown selection
   */
  const fetchAvailableCategories = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        console.warn('No authentication token found.')
        setAvailableCategories([])
        return
      }

      const data = await apiCall(API_ENDPOINTS.GET_CATEGORIES)
      const activeCategories = (data.data || data || []).filter(
        (cat) => cat.isActive
      )
      setAvailableCategories(activeCategories)
      console.log(
        'Available categories fetched successfully:',
        activeCategories
      )
    } catch (error) {
      console.error('Failed to fetch available categories:', error)
      setAvailableCategories([])
    }
  }

  /**
   * Create a new category
   * @param {object} categoryData - Category data (categoryName, description, isActive)
   * @returns {Promise<object>} Success response with category data
   */
  const createCategory = async (categoryData) => {
    try {
      setCategoryLoading(true)
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No authentication token found. Please log in.')
      }

      const response = await apiCall(API_ENDPOINTS.CREATE_CATEGORY, {
        method: 'POST',
        body: JSON.stringify(categoryData),
      })
      console.log('Category created successfully:', response)
      return { success: true, data: response.data || response }
    } catch (error) {
      console.error('Failed to create category:', error)
      throw error
    } finally {
      setCategoryLoading(false)
    }
  }

  /**
   * Update an existing category
   * @param {string} id - Category ID
   * @param {object} categoryData - Updated category data
   * @returns {Promise<object>} Success response with updated category data
   */
  const updateCategory = async (id, categoryData) => {
    try {
      setCategoryLoading(true)
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No authentication token found. Please log in.')
      }

      const response = await apiCall(`${API_ENDPOINTS.UPDATE_CATEGORY}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(categoryData),
      })
      console.log('Category updated successfully:', response)
      return { success: true, data: response.data || response }
    } catch (error) {
      console.error('Failed to update category:', error)
      throw error
    } finally {
      setCategoryLoading(false)
    }
  }

  /**
   * Toggle category active/inactive status
   * @param {string} id - Category ID
   * @param {boolean} isActive - Current active status
   * @returns {Promise<object>} Success response with updated category data
   */
  const toggleCategoryStatus = async (id, isActive) => {
    try {
      setCategoryLoading(true)
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No authentication token found. Please log in.')
      }

      const response = await apiCall(`${API_ENDPOINTS.UPDATE_CATEGORY}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !isActive }),
      })
      console.log('Category status updated successfully:', id, !isActive)
      return { success: true, data: response.data || response }
    } catch (error) {
      console.error('Failed to update category status:', error)
      throw error
    } finally {
      setCategoryLoading(false)
    }
  }

  // ============================================================================
  // MENU ITEM EVENT HANDLERS
  // ============================================================================

  /**
   * Open delete confirmation modal for menu item
   * @param {number} id - Menu item ID
   */
  const handleDelete = (id) => {
    setDeleteConfirm({ open: true, id })
  }

  /**
   * Confirm and execute menu item deletion
   */
  const confirmDelete = async () => {
    const id = deleteConfirm.id
    setDeleteConfirm({ open: false, id: null })

    if (id !== null) {
      const exists = foods.some((food) => food.id === id)
      if (exists) {
        try {
          // TODO: Implement actual API deletion
          // await deleteMenuItem(id)
          setFoods(foods.filter((food) => food.id !== id))
          showNotification('success', 'Menu item deleted successfully.')
        } catch (error) {
          showNotification('error', 'Failed to delete menu item.')
        }
      } else {
        showNotification('error', 'Failed to delete menu item.')
      }
    }
  }

  /**
   * Cancel menu item deletion
   */
  const cancelDelete = () => {
    setDeleteConfirm({ open: false, id: null })
  }

  /**
   * Open edit modal for menu item
   * @param {object} food - Menu item data
   */
  const handleEdit = (food) => {
    setEditFood(food)
    setForm({
      name: food.name,
      description: food.description,
      image: food.image,
    })
    setModalOpen(true)
  }

  /**
   * Handle form input changes for edit modal
   * @param {Event} e - Input change event
   */
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  /**
   * Submit menu item update
   * @param {Event} e - Form submit event
   */
  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      // TODO: Implement actual API update
      // await updateMenuItem(editFood.id, form)
      setFoods(
        foods.map((food) =>
          food.id === editFood.id ? { ...editFood, ...form } : food
        )
      )
      showNotification('success', 'Menu item updated successfully.')
    } catch (error) {
      showNotification('error', 'Failed to update menu item.')
    }
    setModalOpen(false)
    setEditFood(null)
  }

  // ============================================================================
  // FORM HANDLING FUNCTIONS
  // ============================================================================

  /**
   * Handle create form input changes with validation
   * @param {Event} e - Input change event
   */
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target
    setCreateForm((prev) => ({ ...prev, [name]: value }))
    setCreateTouched((prev) => ({ ...prev, [name]: true }))
  }

  /**
   * Toggle menu item status between active/inactive
   */
  const handleStatusToggle = () => {
    setCreateForm((prev) => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active',
    }))
  }

  /**
   * Validate create menu item form
   * @returns {object} Validation errors object
   */
  const validateCreateForm = () => {
    const errors = {}
    if (!createForm.name.trim()) errors.name = 'Dish name is required.'
    if (
      !createForm.price ||
      isNaN(Number(createForm.price)) ||
      Number(createForm.price) <= 0
    )
      errors.price = 'Valid price is required.'
    if (!createForm.categoryId.trim())
      errors.categoryId = 'Category is required.'
    if (!createForm.description.trim())
      errors.description = 'Description is required.'
    if (
      !createForm.image.trim() ||
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(
        createForm.image.trim()
      )
    )
      errors.image = 'Valid image URL is required.'
    return errors
  }

  /**
   * Handle form field blur events for validation
   * @param {Event} e - Blur event
   */
  const handleCreateBlur = (e) => {
    const { name } = e.target
    setCreateTouched((prev) => ({ ...prev, [name]: true }))
    setCreateErrors(validateCreateForm())
  }

  /**
   * Submit create menu item form
   * @param {Event} e - Form submit event
   */
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    const errors = validateCreateForm()
    setCreateErrors(errors)
    setCreateTouched({
      name: true,
      price: true,
      categoryId: true,
      description: true,
      image: true,
    })

    if (Object.keys(errors).length === 0) {
      try {
        // TODO: Implement actual API creation
        // const newMenuItem = await createMenuItem(createForm)
        const newMenuItem = {
          id: Date.now(),
          ...createForm,
          category:
            availableCategories.find(
              (cat) => (cat._id || cat.id) === createForm.categoryId
            )?.categoryName || 'Unknown Category',
        }
        setFoods((prev) => [...prev, newMenuItem])
        showNotification('success', 'Menu item created successfully.')
      } catch (error) {
        showNotification('error', 'Failed to create menu item.')
      }
      setCreateModalOpen(false)
      setCreateForm({
        name: '',
        price: '',
        status: 'active',
        description: '',
        image: '',
        categoryId: '',
      })
      setCreateErrors({})
      setCreateTouched({})
    }
  }

  // Filter foods based on search
  const filteredFoods = foods.filter(
    (food) =>
      food.name.toLowerCase().includes(search.toLowerCase()) ||
      food.description.toLowerCase().includes(search.toLowerCase())
  )

  // ============================================================================
  // CATEGORY EVENT HANDLERS
  // ============================================================================

  /**
   * Toggle category active/inactive status
   * @param {string} id - Category ID
   * @param {boolean} isActive - Current active status
   */
  const handleCategoryStatusToggle = async (id, isActive) => {
    try {
      const result = await toggleCategoryStatus(id, isActive)
      if (result.success) {
        setCategories(
          categories.map((category) =>
            (category._id || category.id) === id
              ? { ...category, isActive: !isActive }
              : category
          )
        )
        // Refresh available categories for the dropdown
        fetchAvailableCategories()
        const action = !isActive ? 'activated' : 'deactivated'
        showNotification('success', `Category ${action} successfully.`)
      }
    } catch (error) {
      const action = isActive ? 'deactivate' : 'activate'
      showNotification('error', `Failed to ${action} category.`)
    }
  }

  /**
   * Open edit modal for category
   * @param {object} category - Category data
   */
  const handleCategoryEdit = (category) => {
    setEditCategory(category)
    setCategoryForm({
      categoryName: category.categoryName,
      description: category.description,
    })
    setCategoryModalOpen(true)
  }

  /**
   * Handle category form input changes
   * @param {Event} e - Input change event
   */
  const handleCategoryFormChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value })
  }

  /**
   * Submit category update
   * @param {Event} e - Form submit event
   */
  const handleCategoryUpdate = async (e) => {
    e.preventDefault()
    try {
      const result = await updateCategory(
        editCategory._id || editCategory.id,
        categoryForm
      )
      if (result.success) {
        setCategories(
          categories.map((category) =>
            (category._id || category.id) ===
            (editCategory._id || editCategory.id)
              ? result.data
              : category
          )
        )
        showNotification('success', 'Category updated successfully.')
      }
    } catch (error) {
      showNotification('error', 'Failed to update category.')
    }
    setCategoryModalOpen(false)
    setEditCategory(null)
  }

  /**
   * Handle create category form input changes with validation
   * @param {Event} e - Input change event
   */
  const handleCreateCategoryFormChange = (e) => {
    const { name, value } = e.target
    setCreateCategoryForm((prev) => ({ ...prev, [name]: value }))
    setCreateCategoryTouched((prev) => ({ ...prev, [name]: true }))
  }

  /**
   * Validate create category form
   * @returns {object} Validation errors object
   */
  const validateCreateCategoryForm = () => {
    const errors = {}
    if (!createCategoryForm.categoryName.trim())
      errors.categoryName = 'Category name is required.'
    if (!createCategoryForm.description.trim())
      errors.description = 'Description is required.'
    return errors
  }

  /**
   * Handle category form field blur events for validation
   * @param {Event} e - Blur event
   */
  const handleCreateCategoryBlur = (e) => {
    const { name } = e.target
    setCreateCategoryTouched((prev) => ({ ...prev, [name]: true }))
    setCreateCategoryErrors(validateCreateCategoryForm())
  }

  /**
   * Submit create category form
   * @param {Event} e - Form submit event
   */
  const handleCreateCategorySubmit = async (e) => {
    e.preventDefault()
    const errors = validateCreateCategoryForm()
    setCreateCategoryErrors(errors)
    setCreateCategoryTouched({
      categoryName: true,
      description: true,
    })

    if (Object.keys(errors).length === 0) {
      try {
        const result = await createCategory(createCategoryForm)
        if (result.success) {
          const newCategory = result.data
          setCategories((prev) => [...prev, newCategory])
          // Refresh available categories for the dropdown
          fetchAvailableCategories()
          showNotification('success', 'Category created successfully.')
        }
      } catch (error) {
        const errorMessage =
          error.message === 'No authentication token found. Please log in.'
            ? 'Please log in to create categories.'
            : 'Failed to create category. Please try again.'
        showNotification('error', errorMessage)
      }
      setCreateCategoryModalOpen(false)
      setCreateCategoryForm({
        categoryName: '',
        description: '',
        isActive: true,
      })
      setCreateCategoryErrors({})
      setCreateCategoryTouched({})
    }
  }

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.categoryName
        .toLowerCase()
        .includes(categorySearch.toLowerCase()) ||
      category.description.toLowerCase().includes(categorySearch.toLowerCase())
  )

  return (
    <div
      className='rounded-lg shadow-2xl bg-white w-full my-8 mx-auto p-6'
      style={{ maxWidth: '110rem' }}
    >
      {/* Accordion Container */}
      <div className='space-y-4'>
        {/* Menu Items Accordion */}
        <div className='border border-gray-200 rounded-lg overflow-hidden'>
          <button
            onClick={() =>
              setActiveAccordion(
                activeAccordion === 'menu-items' ? null : 'menu-items'
              )
            }
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
              {/* Loading Indicator */}
              {loading && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]'>
                  <div className='bg-white rounded-lg p-6 shadow-xl'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto'></div>
                    <p className='mt-2 text-gray-600'>Loading...</p>
                  </div>
                </div>
              )}
              <h1 className='text-xl font-bold mb-4 text-black'>Food Menu</h1>
              {/* Search Bar and Create Button */}
              <div
                className='flex items-center justify-between mb-6 w-full mx-auto'
                style={{ maxWidth: '110rem' }}
              >
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
                    <RefreshCw
                      size={18}
                      className={`${refreshing ? 'animate-spin' : ''}`}
                    />
                  </button>
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow font-semibold text-base transform hover:scale-105 duration-150'
                  >
                    + Create Menu Item
                  </button>
                </div>
              </div>
              <div className='overflow-x-auto' style={{ maxWidth: '110rem' }}>
                <table
                  className='table-auto w-full rounded-lg border-separate'
                  style={{ borderSpacing: 0 }}
                >
                  <thead>
                    <tr>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        No.
                      </th>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        Image
                      </th>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        Name
                      </th>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        Category
                      </th>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        Status
                      </th>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        Description
                      </th>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFoods.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className='text-center text-gray-500 py-8'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          No food items found.
                        </td>
                      </tr>
                    )}
                    {filteredFoods.map((food, idx) => (
                      <tr key={food.id} className='hover:bg-gray-50 transition'>
                        <td
                          className='px-4 py-2 font-mono font-bold text-black align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          {(() => {
                            const foodId = food.id || ''
                            if (foodId.toString().length >= 4) {
                              const last4 = foodId.toString().slice(-4)
                              return (
                                <span>
                                  <span className='text-gray-400'>#</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        foodId.toString()
                                      )
                                      showNotification(
                                        'success',
                                        `ID ${foodId} copied to clipboard!`
                                      )
                                    }}
                                    className='text-blue-600 hover:text-blue-800 underline cursor-pointer font-bold'
                                    title={`Click to copy full ID: ${foodId}`}
                                  >
                                    {last4}
                                  </button>
                                </span>
                              )
                            }
                            return (
                              <span>
                                <span className='text-gray-400'>#</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      foodId.toString()
                                    )
                                    showNotification(
                                      'success',
                                      `ID ${foodId} copied to clipboard!`
                                    )
                                  }}
                                  className='text-blue-600 hover:text-blue-800 underline cursor-pointer font-bold'
                                  title={`Click to copy full ID: ${foodId}`}
                                >
                                  {foodId}
                                </button>
                              </span>
                            )
                          })()}
                        </td>
                        <td
                          className='px-4 py-2 align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          <img
                            src={food.image}
                            alt={food.name}
                            className='w-16 h-16 object-cover rounded-lg shadow'
                          />
                        </td>
                        <td
                          className='px-4 py-2 font-semibold text-lg text-black align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          {food.name}
                        </td>
                        <td
                          className='px-4 py-2 align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800'>
                            {food.category || 'No Category'}
                          </span>
                        </td>
                        <td
                          className='px-4 py-2 align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          <div className='relative status-dropdown'>
                            <button
                              onClick={() => toggleStatusDropdown(food.id)}
                              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                food.status === 'inactive'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {food.status
                                ? food.status.charAt(0).toUpperCase() +
                                  food.status.slice(1)
                                : 'Active'}
                              <svg
                                className='w-3 h-3'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M19 9l-7 7-7-7'
                                />
                              </svg>
                            </button>

                            {statusDropdowns[food.id] && (
                              <div className='absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[120px]'>
                                <div className='py-1'>
                                  <button
                                    onClick={() =>
                                      updateItemStatus(food.id, 'active')
                                    }
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                      food.status === 'active'
                                        ? 'bg-green-50 text-green-700 font-semibold'
                                        : 'text-gray-700'
                                    }`}
                                  >
                                    Active
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateItemStatus(food.id, 'inactive')
                                    }
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                      food.status === 'inactive'
                                        ? 'bg-red-50 text-red-700 font-semibold'
                                        : 'text-gray-700'
                                    }`}
                                  >
                                    Inactive
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td
                          className='px-4 py-2 text-gray-700 align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          {food.description}
                        </td>
                        <td
                          className='px-4 py-2 align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
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
            onClick={() =>
              setActiveAccordion(
                activeAccordion === 'menu-categories' ? null : 'menu-categories'
              )
            }
            className='w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left'
          >
            <div className='flex items-center gap-3'>
              <FolderOpen className='w-5 h-5 text-blue-600' />
              <h2 className='text-xl font-bold text-gray-800'>
                Menu Categories
              </h2>
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
                <h2 className='text-xl font-bold text-black'>
                  Menu Categories
                </h2>
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
                <table
                  className='table-auto w-full rounded-lg border-separate'
                  style={{ borderSpacing: 0 }}
                >
                  <thead>
                    <tr>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        No.
                      </th>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        Category Name
                      </th>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        Description
                      </th>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        Status
                      </th>
                      <th
                        className='px-4 py-2 text-left text-gray-700 font-medium'
                        style={{ border: '1px solid #C0C0C0' }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className='text-center text-gray-500 py-8'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          {categories.length === 0
                            ? 'No category data found.'
                            : 'No categories match your search.'}
                        </td>
                      </tr>
                    )}
                    {filteredCategories.map((category, idx) => (
                      <tr
                        key={category._id || category.id}
                        className='hover:bg-gray-50 transition'
                      >
                        <td
                          className='px-4 py-2 font-mono font-bold text-black align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          {(() => {
                            const categoryId = category._id || category.id || ''
                            if (categoryId.length >= 4) {
                              const last4 = categoryId.slice(-4)
                              return (
                                <span>
                                  <span className='text-gray-400'>#</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(categoryId)
                                      showNotification(
                                        'success',
                                        `Category ID ${categoryId} copied to clipboard!`
                                      )
                                    }}
                                    className='text-blue-600 hover:text-blue-800 underline cursor-pointer font-bold'
                                    title={`Click to copy full Category ID: ${categoryId}`}
                                  >
                                    {last4}
                                  </button>
                                </span>
                              )
                            }
                            return (
                              <span>
                                <span className='text-gray-400'>#</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(categoryId)
                                    showNotification(
                                      'success',
                                      `Category ID ${categoryId} copied to clipboard!`
                                    )
                                  }}
                                  className='text-blue-600 hover:text-blue-800 underline cursor-pointer font-bold'
                                  title={`Click to copy full Category ID: ${categoryId}`}
                                >
                                  {categoryId}
                                </button>
                              </span>
                            )
                          })()}
                        </td>
                        <td
                          className='px-4 py-2 font-semibold text-lg text-black align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          {category.categoryName}
                        </td>
                        <td
                          className='px-4 py-2 text-gray-700 align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          {category.description}
                        </td>
                        <td
                          className='px-4 py-2 align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              category.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td
                          className='px-4 py-2 align-middle'
                          style={{ border: '1px solid #C0C0C0' }}
                        >
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
                              onClick={() =>
                                handleCategoryStatusToggle(
                                  category._id || category.id,
                                  category.isActive
                                )
                              }
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

      {/* Modal for Update */}
      {modalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fade-in'>
            <button
              className='absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold'
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h2 className='text-xl font-bold mb-4 text-black'>
              Update Food Item
            </h2>
            <form onSubmit={handleUpdate} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>Name</label>
                <input
                  type='text'
                  name='name'
                  value={form.name}
                  onChange={handleFormChange}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Description
                </label>
                <textarea
                  name='description'
                  value={form.description}
                  onChange={handleFormChange}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Image URL
                </label>
                <input
                  type='text'
                  name='image'
                  value={form.image}
                  onChange={handleFormChange}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black'
                  required
                />
              </div>
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

      {/* Modal for Create Menu Item (Form) */}
      {createModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fade-in'>
            <button
              className='absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold'
              onClick={() => setCreateModalOpen(false)}
            >
              &times;
            </button>
            <h2 className='text-xl font-bold mb-4 text-black'>
              Create Menu Item
            </h2>
            <form
              className='space-y-6'
              onSubmit={handleCreateSubmit}
              noValidate
            >
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
                  onChange={handleCreateFormChange}
                  onBlur={handleCreateBlur}
                  className={`w-full border ${
                    createErrors.name && createTouched.name
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black`}
                  autoComplete='off'
                />
                {createErrors.name && createTouched.name && (
                  <span className='text-xs text-red-500 mt-1 block'>
                    {createErrors.name}
                  </span>
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
                  onChange={handleCreateFormChange}
                  onBlur={handleCreateBlur}
                  className={`w-full border ${
                    createErrors.price && createTouched.price
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black`}
                  min='0'
                  step='0.01'
                  autoComplete='off'
                />
                {createErrors.price && createTouched.price && (
                  <span className='text-xs text-red-500 mt-1 block'>
                    {createErrors.price}
                  </span>
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
                  onChange={handleCreateFormChange}
                  onBlur={handleCreateBlur}
                  className={`w-full border ${
                    createErrors.categoryId && createTouched.categoryId
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black bg-white`}
                  autoComplete='off'
                >
                  <option value=''>Select a category</option>
                  {availableCategories.map((category) => (
                    <option
                      key={category._id || category.id}
                      value={category._id || category.id}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {createErrors.categoryId && createTouched.categoryId && (
                  <span className='text-xs text-red-500 mt-1 block'>
                    {createErrors.categoryId}
                  </span>
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
                    onClick={handleStatusToggle}
                  />
                ) : (
                  <ToggleLeft
                    size={24}
                    className='text-gray-400 cursor-pointer'
                    onClick={handleStatusToggle}
                  />
                )}
                <span
                  className={`font-semibold ${
                    createForm.status === 'active'
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  {createForm.status.charAt(0).toUpperCase() +
                    createForm.status.slice(1)}
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
                  onChange={handleCreateFormChange}
                  onBlur={handleCreateBlur}
                  className={`w-full border ${
                    createErrors.description && createTouched.description
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black`}
                  rows={3}
                  autoComplete='off'
                />
                {createErrors.description && createTouched.description && (
                  <span className='text-xs text-red-500 mt-1 block'>
                    {createErrors.description}
                  </span>
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
                  onChange={handleCreateFormChange}
                  onBlur={handleCreateBlur}
                  className={`w-full border ${
                    createErrors.image && createTouched.image
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black`}
                  autoComplete='off'
                />
                {createErrors.image && createTouched.image && (
                  <span className='text-xs text-red-500 mt-1 block'>
                    {createErrors.image}
                  </span>
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

      {/* Modal for Delete Confirmation */}
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
                onClick={cancelDelete}
                className='px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold shadow transition'
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Category Update */}
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
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Category Name
                </label>
                <input
                  type='text'
                  name='categoryName'
                  value={categoryForm.categoryName}
                  onChange={handleCategoryFormChange}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Description
                </label>
                <textarea
                  name='description'
                  value={categoryForm.description}
                  onChange={handleCategoryFormChange}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  rows={3}
                  required
                />
              </div>
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
                  {categoryLoading ? (
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  ) : null}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Create Category */}
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
            <form
              className='space-y-6'
              onSubmit={handleCreateCategorySubmit}
              noValidate
            >
              {/* Category Name */}
              <div>
                <label className='block mb-1 text-sm font-semibold text-gray-700'>
                  <span className='inline-flex items-center gap-1'>
                    <FolderOpen size={18} className='text-gray-500' /> Category
                    Name
                  </span>
                </label>
                <input
                  type='text'
                  name='categoryName'
                  value={createCategoryForm.categoryName}
                  onChange={handleCreateCategoryFormChange}
                  onBlur={handleCreateCategoryBlur}
                  className={`w-full border ${
                    createCategoryErrors.categoryName &&
                    createCategoryTouched.categoryName
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  autoComplete='off'
                />
                {createCategoryErrors.categoryName &&
                  createCategoryTouched.categoryName && (
                    <span className='text-xs text-red-500 mt-1 block'>
                      {createCategoryErrors.categoryName}
                    </span>
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
                  onChange={handleCreateCategoryFormChange}
                  onBlur={handleCreateCategoryBlur}
                  className={`w-full border ${
                    createCategoryErrors.description &&
                    createCategoryTouched.description
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  rows={3}
                  autoComplete='off'
                />
                {createCategoryErrors.description &&
                  createCategoryTouched.description && (
                    <span className='text-xs text-red-500 mt-1 block'>
                      {createCategoryErrors.description}
                    </span>
                  )}
              </div>

              {/* Status Toggle */}
              <div className='flex items-center gap-2'>
                {createCategoryForm.isActive ? (
                  <ToggleRight
                    size={24}
                    className='text-green-500 cursor-pointer'
                    onClick={() =>
                      setCreateCategoryForm((prev) => ({
                        ...prev,
                        isActive: !prev.isActive,
                      }))
                    }
                  />
                ) : (
                  <ToggleLeft
                    size={24}
                    className='text-gray-400 cursor-pointer'
                    onClick={() =>
                      setCreateCategoryForm((prev) => ({
                        ...prev,
                        isActive: !prev.isActive,
                      }))
                    }
                  />
                )}
                <span
                  className={`font-semibold ${
                    createCategoryForm.isActive
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
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
                  disabled={
                    Object.keys(validateCreateCategoryForm()).length > 0 ||
                    categoryLoading
                  }
                  className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow disabled:opacity-50 flex items-center gap-2'
                >
                  {categoryLoading ? (
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  ) : null}
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
            <span>
              Notifications blocked. Please enable in browser settings.
            </span>
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
          <Bell
            className={`w-6 h-6 animate-bounce ${
              notification.type === 'success'
                ? 'text-green-200'
                : 'text-red-200'
            }`}
          />
          {notification.message}
        </div>
      )}
    </div>
  )
}

export default Menus
