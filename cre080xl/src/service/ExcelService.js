import axios from "axios";

const Adminurl = "http://localhost:8080";

const ExcelService = {
  getExcel: async () => {
    const response = await axios.get(Adminurl + "/get");
    return response.data;
  },
  postExcel: async (data) => {
    const response = await axios.post(Adminurl + "/saveAll", data);
    return response.data;
  },
  getAllFiles: async () => {
    const response = await axios.get(Adminurl + "/getAllFiles");
    return response.data;
  },
};

export default ExcelService;
