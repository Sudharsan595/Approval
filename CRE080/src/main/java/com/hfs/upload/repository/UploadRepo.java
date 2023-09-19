package com.hfs.upload.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hfs.upload.bean.UploadBean;


@Repository
public interface UploadRepo extends JpaRepository<UploadBean, Long>{
	@Query(value = "SELECT u.CONTRACT_BRANCH FROM Cc_Contract_Master u WHERE u.CONTRACT_NUMBER =:CONTRACT_NUMBER", nativeQuery = true)
	String getBranchByfileNo(@Param("CONTRACT_NUMBER")String fileno);

	@Query(value = "Select Base_HL_File_Number from UploadBean")
	List<String> getAllFIles();
	
//	@Query(value = "select * from Hfs_File_Upload where BRANCH =:BRANCH", nativeQuery = true)
	
	@Query(value = "select * from Hfs_File_Upload where approval = 0 and BRANCH =:BRANCH", nativeQuery = true)

	List<UploadBean>findBybranch(@Param("BRANCH")String Branch);

  

  
}
