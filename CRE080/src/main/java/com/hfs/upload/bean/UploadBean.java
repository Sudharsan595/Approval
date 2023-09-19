package com.hfs.upload.bean;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

 

@Entity
@Table(name="Hfs_File_Upload")
public class UploadBean {
	 @Id
     @GeneratedValue(strategy=GenerationType.IDENTITY)
     private int Id;
	 @Column
	 private String Base_HL_File_Number;
	 @Column
	 private String Loan_amount_Max;
	 @Column
	 private String Tenor_Min ;
	 @Column
	 private String Tenor_Max;
	 @Column
	 private String Net_ROI;
	 @Column
	 private String Net_Income;
	 @Column
	 private String Obligation;
	 @Column
	 private String Fees_Percentage;
	 @Column
	 private String Fees_Amount;
	 @Column
	 private String Branch;
	 @Column
	 private boolean Status;
	 @Column
	 private String Comments;
	 @Column
	 private boolean approval;




	public boolean isApproval() {
		return approval;
	}
	public void setApproval(boolean approval) {
		this.approval = approval;
	}
	public String getComments() {
		return Comments;
	}
	public void setComments(String comments) {
		Comments = comments;
	}
	public String getBranch() {
		return Branch;
	}
	public void setBranch(String branch) {
		Branch = branch;
	}
	public boolean isStatus() {
		return Status;
	}
	public Boolean setStatus(boolean status) {
		return Status = status;
	}
	public int getId() {
		return Id;
	}
	public void setId(int id) {
		Id = id;
	}
	public String getBase_HL_File_Number() {
		return Base_HL_File_Number;
	}
	public void setBase_HL_File_Number(String base_HL_File_Number) {
		Base_HL_File_Number = base_HL_File_Number;
	}
	public String getLoan_amount_Max() {
		return Loan_amount_Max;
	}
	public void setLoan_amount_Max(String loan_amount_Max) {
		Loan_amount_Max = loan_amount_Max;
	}
	public String getTenor_Min() {
		return Tenor_Min;
	}
	public void setTenor_Min(String tenor_Min) {
		Tenor_Min = tenor_Min;
	}
	public String getTenor_Max() {
		return Tenor_Max;
	}
	public void setTenor_Max(String tenor_Max) {
		Tenor_Max = tenor_Max;
	}
	public String getNet_ROI() {
		return Net_ROI;
	}
	public void setNet_ROI(String net_ROI) {
		Net_ROI = net_ROI;
	}
	public String getNet_Income() {
		return Net_Income;
	}
	public void setNet_Income(String net_Income) {
		Net_Income = net_Income;
	}
	public String getObligation() {
		return Obligation;
	}
	public void setObligation(String obligation) {
		Obligation = obligation;
	}
	public String getFees_Percentage() {
		return Fees_Percentage;
	}
	public void setFees_Percentage(String fees_Percentage) {
		Fees_Percentage = fees_Percentage;
	}
	public String getFees_Amount() {
		return Fees_Amount;
	}
	public void setFees_Amount(String fees_Amount) {
		Fees_Amount = fees_Amount;
	}



}