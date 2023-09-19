package com.hfs.upload.controller;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hfs.upload.bean.UploadBean;
import com.hfs.upload.repository.UploadRepo;


@RestController
@CrossOrigin(origins ="*")
public class UploadController {
	@Autowired
	public UploadRepo uploadrepo;
	@PostMapping("/saves")
	public String addExcelBean(@RequestBody UploadBean uploadbean) {
		try {
			uploadrepo.save(uploadbean);
			return "Saved Succesfully";
		}catch(Exception e) {
			System.out.println(e.getMessage());
			return e.getMessage();
		}
	}
	
	@GetMapping("get")
	public List<UploadBean>getall(){
		return uploadrepo.findAll();
	}
	@GetMapping("getAllFiles")
	public List<String>getAllFIles(){
		return uploadrepo.getAllFIles();
	}
	
	@PostMapping("/saveAll")
	public List<String> saveAll(@RequestBody List<UploadBean> exceldata) {
	    List<String> nullBranchFileNumbers = new ArrayList<>();
	    String br = "True";

	    for (UploadBean i : exceldata) {
	        if (i.getObligation() == null || i.getObligation().isEmpty()) {
	            i.setObligation("0");
	        }
	        String branch = uploadrepo.getBranchByfileNo(i.getBase_HL_File_Number());
	        i.setBranch(branch);

	        if (branch == null) {
	            br = "false";
	            nullBranchFileNumbers.add(i.getBase_HL_File_Number());
	        }
	    }

	    if (br.equals("True")) {
	        for (UploadBean i : exceldata) {
	        	i.setStatus(true);
//	        	i.setApproval(false);
	            uploadrepo.save(i);
	        }
	    }

	    return nullBranchFileNumbers;
	}

	@GetMapping("/getallBranch/{fileno}")
	public String getBranchByfileNo(@PathVariable(name = "fileno") String fileno) {
	    return uploadrepo.getBranchByfileNo(fileno);
	}
	@GetMapping("/getbybranch/{branch}")
	public List<UploadBean> getAllByBranch(@PathVariable(name = "branch") String branch) {
		System.out.println(branch);
	    return uploadrepo.findBybranch(branch);
	}
	@PutMapping("/updateAll")
	public String updateAll(@RequestBody  List<UploadBean>  exceldata){
		 for (UploadBean i : exceldata) {
			i.setApproval(true);
 			 uploadrepo.save(i);
		    }
		return "true";
	}
	
}
