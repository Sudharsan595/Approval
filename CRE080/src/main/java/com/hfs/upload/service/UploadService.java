package com.hfs.upload.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hfs.upload.repository.UploadRepo;

@Service
public class UploadService {
	
	@Autowired
	public UploadRepo uploadrepo;
	
	
//	public List<UploadBean>findByBranch(String Branch){
//		return uploadrepo.findBybranch(Branch);
//	};
//	

}
