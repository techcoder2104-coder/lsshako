import api from './axios'

// Get all categories
export const getCategories = async () => {
  try {
    const { data } = await api.get('/categories')
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// Get single category
export const getCategoryById = async (id) => {
  try {
    const { data } = await api.get(`/categories/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching category:', error)
    throw error
  }
}

// Create category (admin)
export const createCategory = async (categoryData) => {
  try {
    const { data } = await api.post('/categories', categoryData)
    return data
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

// Add subcategory (admin)
export const addSubcategory = async (categoryId, subcategoryData) => {
  try {
    const { data } = await api.post(`/categories/${categoryId}/subcategories`, subcategoryData)
    return data
  } catch (error) {
    console.error('Error adding subcategory:', error)
    throw error
  }
}

// Get feature template for category/subcategory
export const getFeatureTemplate = async (categoryId, subcategoryId = null) => {
  try {
    const url = subcategoryId 
      ? `/categories/${categoryId}/template/${subcategoryId}`
      : `/categories/${categoryId}/template/null`
    const { data } = await api.get(url)
    return data
  } catch (error) {
    console.error('Error fetching template:', error)
    return { featureFields: [], specFields: [] }
  }
}

// Create/Update feature template (admin)
export const saveFeatureTemplate = async (categoryId, templateData) => {
  try {
    const { data } = await api.post(`/categories/${categoryId}/template`, templateData)
    return data
  } catch (error) {
    console.error('Error saving template:', error)
    throw error
  }
}

export default {
  getCategories,
  getCategoryById,
  createCategory,
  addSubcategory,
  getFeatureTemplate,
  saveFeatureTemplate
}
