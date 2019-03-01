import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,FormBuilder,Validators,AbstractControl} from '@angular/forms';
import { CustomValidators } from '../shared/custom-validators';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

/*reactive Form validations*/
validationMessages={
  'fullName':{
    'required':'Full name required',
    'minlength':'Full must be greater than 2 characters',
    'maxlength':'Full must be less than 10 characters'
  },
  'email':{
    'required':'Required email address',
    'emailDomain':'emailDomain should dell.com'
  },
  'phone':{
    'required':'required Phone'
  },
  'skillName':{
    'required':'required skillname'
  },
  'experienceInYear':{
    'required':'required exeperience'
  },
  'proficiency':{
    'required':'required Proficiency'
  }
}
formErrors ={
  'fullName':'',
  'email':'',
  'phone':'',
  'skillName':'',
  'experienceInYear':'',
  'proficiency':'',
}
/*reactive Form validations emd*/



   /*  employeeForm = new FormGroup({
      fullName:new FormControl(''),
      email: new FormControl(''),
      skills:new FormGroup({
          skillName:new FormControl(''),
          experienceInYear:new FormControl(''),
          proficiency:new FormControl('')
      })
    }); */
    /* we can build the froms using FormBuilder also*/
    employeeForm = this.fb.group({
      fullName:['',[Validators.required,Validators.minLength(2),Validators.maxLength(10)]],
      contactPreference:['email'],
      email:['',[Validators.required,CustomValidators.emailDomain('dell.com')]],
      phone:['',Validators.required],
      skills:this.fb.group({
        skillName:['',Validators.required],
        experienceInYear:['',Validators.required],
        proficiency:['',Validators.required]
      })
    });
    
/* looping from geroups*/
    logkeyValidationErrors(group:FormGroup = this.employeeForm):void{
      Object.keys(group.controls).forEach((key:string)=>{
        const abstractControl = group.get(key);
        if(abstractControl instanceof FormGroup){
          this.logkeyValidationErrors(abstractControl)
        }
        else{
          this.formErrors[key]='';
          if(abstractControl && !abstractControl.valid){
            const messages=this.validationMessages[key]
            for(const errorKey in abstractControl.errors){
              if(errorKey){
                this.formErrors[key] += messages[errorKey]+'';
              }
            }
          }
          console.log('key=' +key+ 'value=' +abstractControl.value)
        }
      });
     
    }
    /* looping from geroups end*/

  onSubmit(){
    console.log(this.employeeForm.value);
    console.log(this.employeeForm.get('fullName').value);
    console.log(this.employeeForm.get('email').value);
  }
  onDataLoad():void{
   this.logkeyValidationErrors(this.employeeForm)
   console.log(this.formErrors);
   /*  this.employeeForm.patchValue({
      fullName:"Venkatesh",
      email:"vboyini1@gmail.com",
      skills:{
        skillName:"Angular 7",
        experienceInYear:"2",
        proficiency:"intermediate"
      }
    }) */
  }
  /*contact preferenc change*/

  onContactPreferenceChange(selectedValue: string){
    const phoneFormControl= this.employeeForm.get('phone');
    if(selectedValue === 'phone'){
      phoneFormControl.setValidators(Validators.required);
    }else{
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
  }
    /*contact preferenc change end*/

  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.employeeForm.get('contactPreference').valueChanges.subscribe((data:string) =>{
      this.onContactPreferenceChange(data);
    })

    this.employeeForm.valueChanges.subscribe((data)=>{
      this.logkeyValidationErrors(this.employeeForm);
    })
  }
  
}

