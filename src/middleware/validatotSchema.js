var schemaEntreprise = {
  entreprise: {
    trype: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
    test: /^[a-z0-9]+$/gi,
  },
};

