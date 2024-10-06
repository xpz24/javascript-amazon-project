export function getDeliveryOption(optionId) {
  return deliveryOptions.find(option => option.id === optionId);// || deliveryOptions[0];
}

export const deliveryOptions = [{
  id: 0,
  deliveryTime: 7,
  deliveryPrice: 0 
  }, {
  id: 1,
  deliveryTime: 3,
  deliveryPrice: 499
  }, {
  id: 2,
  deliveryTime: 1,
  deliveryPrice: 999
}];