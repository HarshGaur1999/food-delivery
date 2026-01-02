import {create} from 'zustand';
import {
  adminRepository,
  MenuCategory,
  MenuItem,
} from '@data/repositories/adminRepository';

interface MenuState {
  categories: MenuCategory[];
  items: MenuItem[];
  selectedCategory: MenuCategory | null;
  selectedItem: MenuItem | null;
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchItems: () => Promise<void>;
  createCategory: (category: Partial<MenuCategory>) => Promise<void>;
  updateCategory: (id: number, category: Partial<MenuCategory>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  toggleCategory: (id: number) => Promise<void>;
  createItem: (item: Partial<MenuItem>) => Promise<void>;
  updateItem: (id: number, item: Partial<MenuItem>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  toggleItem: (id: number) => Promise<void>;
  clearError: () => void;
}

export const menuStore = create<MenuState>((set, get) => ({
  categories: [],
  items: [],
  selectedCategory: null,
  selectedItem: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({isLoading: true, error: null});
    try {
      const categories = await adminRepository.getCategories();
      set({categories, isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  fetchItems: async () => {
    set({isLoading: true, error: null});
    try {
      const items = await adminRepository.getMenuItems();
      set({items, isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch items',
        isLoading: false,
      });
    }
  },

  createCategory: async (category: Partial<MenuCategory>) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.createCategory(category);
      await get().fetchCategories();
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to create category',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id: number, category: Partial<MenuCategory>) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.updateCategory(id, category);
      await get().fetchCategories();
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to update category',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.deleteCategory(id);
      await get().fetchCategories();
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to delete category',
        isLoading: false,
      });
      throw error;
    }
  },

  toggleCategory: async (id: number) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.toggleCategory(id);
      await get().fetchCategories();
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to toggle category',
        isLoading: false,
      });
      throw error;
    }
  },

  createItem: async (item: Partial<MenuItem>) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.createMenuItem(item);
      await get().fetchItems();
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to create item',
        isLoading: false,
      });
      throw error;
    }
  },

  updateItem: async (id: number, item: Partial<MenuItem>) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.updateMenuItem(id, item);
      await get().fetchItems();
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to update item',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteItem: async (id: number) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.deleteMenuItem(id);
      await get().fetchItems();
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to delete item',
        isLoading: false,
      });
      throw error;
    }
  },

  toggleItem: async (id: number) => {
    set({isLoading: true, error: null});
    try {
      await adminRepository.toggleMenuItem(id);
      await get().fetchItems();
      set({isLoading: false});
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to toggle item',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({error: null});
  },
}));







