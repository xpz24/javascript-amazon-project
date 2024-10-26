interface DeliveryOption {
  id: number;
  deliveryTime: number;
  deliveryPrice: number;
}

export function getDeliveryOption(optionId: number): DeliveryOption {
  const matchingDeliveryOption = deliveryOptions.find((option) => option.id === optionId);
  if (!matchingDeliveryOption) {
    throw new Error('Matching delivery option not found');
  }
  return matchingDeliveryOption;
}

export const deliveryOptions: DeliveryOption[] = [
  {
    id: 0,
    deliveryTime: 7,
    deliveryPrice: 0,
  },
  {
    id: 1,
    deliveryTime: 3,
    deliveryPrice: 499,
  },
  {
    id: 2,
    deliveryTime: 1,
    deliveryPrice: 999,
  },
];
