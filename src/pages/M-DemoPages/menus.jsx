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
} from 'lucide-react'

// API Configuration
const API_BASE_URL = 'https://your-api-endpoint.com/api'
const API_ENDPOINTS = {
  GET_MENU: '/menu',
  CREATE_MENU: '/menu',
  UPDATE_MENU: '/menu',
  DELETE_MENU: '/menu',
}

// API Helper Functions
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add your authentication headers here
        // 'Authorization': `Bearer ${token}`,
      },
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

const initialFoods = [
  {
    id: 1,
    name: 'Pizza Margherita',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil.',
  },
  {
    id: 2,
    name: 'Cheeseburger',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
    description:
      'Juicy beef patty, cheddar cheese, lettuce, tomato, and onion.',
  },
  {
    id: 3,
    name: 'Chicken Alfredo Pasta',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    description: 'Creamy Alfredo sauce with grilled chicken and fettuccine.',
  },
  {
    id: 4,
    name: 'Vegan Salad Bowl',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    description: 'Fresh greens, avocado, cherry tomatoes, and vinaigrette.',
  },
  {
    id: 5,
    name: 'Grilled Salmon',
    image:
      'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
    description: 'Salmonm fillet grilled to perfection with lemon and herbs.',
  },
]

const Menus = () => {
  const [foods, setFoods] = useState(initialFoods)
  const [editFood, setEditFood] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [search, setSearch] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    price: '',
    status: 'active',
    description: '',
    image: '',
  })
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null })
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: '',
  })
  const [createErrors, setCreateErrors] = useState({})
  const [createTouched, setCreateTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [statusDropdowns, setStatusDropdowns] = useState({})
  const [notificationPermission, setNotificationPermission] =
    useState('default')
  const [refreshing, setRefreshing] = useState(false)

  // Enhanced notification function
  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    })

    // Show browser notification
    setTimeout(() => {
      const title = type === 'success' ? 'Success!' : 'Error!'
      showBrowserNotification(title, message, type)
    }, 100)

    // Auto hide after 4 seconds
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' })
    }, 4000)
  }

  // Show browser notification
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

  // Request notification permission on component mount
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

  // Fetch menu data from API
  const fetchMenuData = async () => {
    try {
      setLoading(true)
      // const data = await apiCall(API_ENDPOINTS.GET_MENU)
      // setFoods(data.menu || [])
      console.log('Fetching menu data from API...')
    } catch (error) {
      console.error('Failed to fetch menu data:', error)
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to load menu data.',
      })
    } finally {
      setLoading(false)
    }
  }

  // Refresh table data
  const refreshTableData = async () => {
    try {
      setRefreshing(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In real implementation, this would fetch fresh data from API
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

  // Load data on component mount
  useEffect(() => {
    // fetchMenuData()
    console.log('Component mounted - ready to fetch data when API is available')
  }, [])

  const handleDelete = (id) => {
    setDeleteConfirm({ open: true, id })
  }

  const confirmDelete = async () => {
    const id = deleteConfirm.id
    // Close the modal first
    setDeleteConfirm({ open: false, id: null })

    if (id !== null) {
      const exists = foods.some((food) => food.id === id)
      if (exists) {
        try {
          // await deleteMenuItem(id)
          setFoods(foods.filter((food) => food.id !== id))
          // Show notification immediately after deletion
          showNotification('success', 'Menu item deleted successfully.')
        } catch (error) {
          showNotification('error', 'Failed to delete menu item.')
        }
      } else {
        showNotification('error', 'Failed to delete menu item.')
      }
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm({ open: false, id: null })
  }

  const handleEdit = (food) => {
    setEditFood(food)
    setForm({
      name: food.name,
      description: food.description,
      image: food.image,
    })
    setModalOpen(true)
  }

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
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

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target
    setCreateForm((prev) => ({ ...prev, [name]: value }))
    setCreateTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleStatusToggle = () => {
    setCreateForm((prev) => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active',
    }))
  }

  const validateCreateForm = () => {
    const errors = {}
    if (!createForm.name.trim()) errors.name = 'Dish name is required.'
    if (
      !createForm.price ||
      isNaN(Number(createForm.price)) ||
      Number(createForm.price) <= 0
    )
      errors.price = 'Valid price is required.'
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

  const handleCreateBlur = (e) => {
    const { name } = e.target
    setCreateTouched((prev) => ({ ...prev, [name]: true }))
    setCreateErrors(validateCreateForm())
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    const errors = validateCreateForm()
    setCreateErrors(errors)
    setCreateTouched({
      name: true,
      price: true,
      description: true,
      image: true,
    })
    if (Object.keys(errors).length === 0) {
      try {
        // const newMenuItem = await createMenuItem(createForm)
        // Add to local state for now
        const newMenuItem = {
          id: Date.now(),
          ...createForm,
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

  return (
    <div
      className='rounded-lg shadow-2xl bg-white w-full my-8 mx-auto p-6'
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
                  colSpan={6}
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
                  #MENU{String(idx + 12).padStart(4, '0')}
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
                            onClick={() => updateItemStatus(food.id, 'active')}
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
