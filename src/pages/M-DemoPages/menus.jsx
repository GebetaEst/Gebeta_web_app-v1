import React, { useState } from 'react'
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
} from 'lucide-react'

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
      'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
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

  const handleDelete = (id) => {
    setDeleteConfirm({ open: true, id })
  }

  const confirmDelete = () => {
    const id = deleteConfirm.id
    if (id !== null) {
      const exists = foods.some((food) => food.id === id)
      if (exists) {
        setFoods(foods.filter((food) => food.id !== id))
        setNotification({
          show: true,
          type: 'success',
          message: 'Menu item deleted successfully.',
        })
      } else {
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to delete menu item.',
        })
      }
    }
    setDeleteConfirm({ open: false, id: null })
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' })
    }, 4000)
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

  const handleUpdate = (e) => {
    e.preventDefault()
    setFoods(
      foods.map((food) =>
        food.id === editFood.id ? { ...editFood, ...form } : food
      )
    )
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

  const handleCreateSubmit = (e) => {
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
      // Here you would add the new menu item logic
      // For now, just close the modal and reset
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      food.status === 'inactive'
                        ? 'bg-gray-300 text-gray-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {food.status
                      ? food.status.charAt(0).toUpperCase() +
                        food.status.slice(1)
                      : 'Active'}
                  </span>
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

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-lg shadow-lg text-white text-lg font-semibold transition-all duration-500 ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } animate-fade-in`}
          style={{ minWidth: '250px' }}
        >
          {notification.message}
        </div>
      )}
    </div>
  )
}

export default Menus
