import React, { useState } from 'react'
import { Pencil, Trash2, Search } from 'lucide-react'

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

  const handleDelete = (id) => {
    setFoods(foods.filter((food) => food.id !== id))
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

  // Filter foods based on search
  const filteredFoods = foods.filter(
    (food) =>
      food.name.toLowerCase().includes(search.toLowerCase()) ||
      food.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='rounded-lg shadow-2xl bg-white w-full max-w-5xl my-8 mx-auto p-6'>
      <h1 className='text-xl font-bold mb-4 text-black'>Food Menu</h1>
      {/* Search Bar */}
      <div className='flex items-center justify-start mb-6 w-full max-w-xs'>
        <div className='relative w-full'>
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
      </div>
      <div className='overflow-x-auto'>
        <table className='table-auto w-full rounded-lg'>
          <thead>
            <tr>
              <th className='px-4 py-2 text-left text-gray-700 font-medium'>
                No.
              </th>
              <th className='px-4 py-2 text-left text-gray-700 font-medium'>
                Image
              </th>
              <th className='px-4 py-2 text-left text-gray-700 font-medium'>
                Name
              </th>
              <th className='px-4 py-2 text-left text-gray-700 font-medium'>
                Description
              </th>
              <th className='px-4 py-2 text-left text-gray-700 font-medium'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFoods.length === 0 && (
              <tr>
                <td colSpan={5} className='text-center text-gray-500 py-8'>
                  No food items found.
                </td>
              </tr>
            )}
            {filteredFoods.map((food, idx) => (
              <tr
                key={food.id}
                className='border-b border-gray-200 hover:bg-gray-50 transition'
              >
                <td className='px-4 py-2 font-mono font-bold text-black align-middle'>
                  #MENU{String(idx + 12).padStart(4, '0')}
                </td>
                <td className='px-4 py-2 align-middle'>
                  <img
                    src={food.image}
                    alt={food.name}
                    className='w-16 h-16 object-cover rounded-lg shadow'
                  />
                </td>
                <td className='px-4 py-2 font-semibold text-lg text-black align-middle'>
                  {food.name}
                </td>
                <td className='px-4 py-2 text-gray-700 align-middle'>
                  {food.description}
                </td>
                <td className='px-4 py-2 align-middle'>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleEdit(food)}
                      className='flex items-center gap-1 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow transition font-semibold text-base'
                    >
                      <Pencil size={16} /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(food.id)}
                      className='flex items-center gap-1 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow transition font-semibold text-base'
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
    </div>
  )
}

export default Menus
