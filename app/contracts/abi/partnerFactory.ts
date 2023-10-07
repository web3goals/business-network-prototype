export const partnerFactoryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "partner",
        type: "address",
      },
    ],
    name: "PartnerCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_details",
        type: "string",
      },
    ],
    name: "becomePartner",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getPartner",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "address",
            name: "partner",
            type: "address",
          },
        ],
        internalType: "struct PartnerFactory.PartnerParams",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPartners",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "address",
            name: "partner",
            type: "address",
          },
        ],
        internalType: "struct PartnerFactory.PartnerParams[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "partners",
    outputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "partner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
