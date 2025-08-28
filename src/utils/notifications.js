import useUserStore from '../Store/UseStore';

// Utility functions to add notifications from anywhere in the app
export const addNotification = (type, title, message) => {
  const store = useUserStore.getState();
  store.addNotification({ type, title, message });
};

export const addSuccessNotification = (title, message) => {
  addNotification('success', title, message);
};

export const addErrorNotification = (title, message) => {
  addNotification('error', title, message);
};

export const addWarningNotification = (title, message) => {
  addNotification('warning', title, message);
};

export const addInfoNotification = (title, message) => {
  addNotification('info', title, message);
};

// Example usage:
// import { addSuccessNotification, addErrorNotification } from '../utils/notifications';
// 
// addSuccessNotification('Success!', 'Your action was completed successfully');
// addErrorNotification('Error!', 'Something went wrong');
// addWarningNotification('Warning!', 'Please check your input');
// addInfoNotification('Info', 'Here is some information for you');
