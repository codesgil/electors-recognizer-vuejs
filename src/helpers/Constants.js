const CONSTANTS = {
  defaultUserForm: () => {
    return {
      username: null,
      password: null,
      first_name: null,
      role: null,
      email: null,
      phone: null,
      is_active: null,
      voteOffice: null,
      repeat_password: null
    };
  },
  defaultElectorForm: () => {
    return {
      name: null,
      phone: null,
      gender: null,
      surname: null,
      birthDate: null,
      birthPlace: null,
      localisation: null,
      voteOffice: null,
      created: {
        start: null,
        end: null
      }
    };
  },
  defaultCampaignForm: () => {
    return {
      name: null,
      enabled: null
    };
  },
  defaultVoteForm: () => {
    return {
      electorName: null,
      electorMatricule: null,
      campaign: null,
      voted: null,
      created: {
        start: null,
        end: null
      }
    };
  },
  defaultVoteOfficeForm: () => {
    return {
      name: null,
      enabled: null
    };
  },
};

export default CONSTANTS;
