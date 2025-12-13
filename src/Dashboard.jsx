import React, { useState} from 'react'
import * as XLSX from "xlsx";
import { Plus, Edit2, Trash2, Save, X, Tag, Menu, Home, List, FileText, LogOut } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import { useEffect } from 'react';



const CardDetail = ({ label, value }) => (
    <div className="mb-1">
        <span className="font-semibold text-gray-500 text-sm">{label}:</span>
        <span className="ml-2 text-gray-800 font-medium">{value}</span>
    </div>
);



const Dashboard = () => {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('add');
  const [userData, setUserData] = useState();
  const [clicked, setClicked] = useState();



  //Convert JSON data into excel sheet data
  function downloadExcelFromJson(data, filename = "alumni.xlsx"){
   
    if (!data || !data.length) {
    alert("No data to export");
    return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);

     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

     // Write and trigger download in browser
     XLSX.writeFile(workbook, filename);
  }



    async function dataGet(){
    try {
      const response = await fetch('https://api.ultimatejaipurians.in/admin/admin/all-user',{
                                    method: 'GET',
                                    credentials: "include",
                                    headers: {
                                    Authorization: "Bearer "+localStorage.getItem("token"),
                                    "Content-Type" : "application/json"}
                                  })

            const result = await response.json();
            const {status, data} = result;

            if(status){
              setUserData(data);
              console.log(userData)
            } else {
              alert('Something error to data fetch..')
            }

    } catch (error) {
      alert('Network Error, Something is wrong')
    }
  }






  useEffect(() => {

    async function logout() {
      
    
      const res = await fetch('https://api.ultimatejaipurians.in/admin/logout',
                            {
                              method: 'GET',
                              credentials: "include",
                              headers: {
                                  Authorization: "Bearer "+localStorage.getItem("token"),
                                  "Content-Type" : "application/json"
                                }
                              
                            }
                          )

        const result = await res.json();

        const {status} = result;

        if(status){
         localStorage.removeItem('login');
         localStorage.removeItem('token');
         navigate('/login');

        } else {
          alert('Network Error, Something is wrong')
        }

    }

    if(clicked){
      logout();
    }


  }, [clicked])



 




  const menuItems = [
    { id: 'dashboard', label: 'Get Data', icon: Home },
    // { id: 'add', label: 'Statistics', icon: Plus },
  ];

  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out 
                      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Q&A Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveView(item.id);
                      if(item.id === 'list' || item.id === 'dashboard'){
                        dataGet()
                      } 
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeView === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-64 p-4  border-t border-gray-700">
           <div  
                 className='text-white py-4'>
              <div onClick={() => setClicked(true)} className='flex gap-x-2.5 justify-center items-center text-lg bg-blue-600 px-4 py-2.5 rounded-lg transition-colors hover:cursor-pointer'>
                <button>Logout</button> 
                <LogOut/>
              </div>
           </div>
        </div>

      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* Main Content */}
      <div className=" flex-1 flex flex-col overflow-hidden">


        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.id === activeView)?.label || 'Dashboard'}
            </h2>
            <div className="w-6 lg:w-auto"></div>

             <div className='flex items-center justify-center'>
          <button onClick={()=> { downloadExcelFromJson(userData, "users.xlsx")}} className='px-5 py-2 text-white rounded-2xl cursor-pointer bg-blue-500 hover:scale-105 transition-all' type="button">Download Alumni Data</button>
        </div>
          </div>
        </header>





        <div className='min-h-fit w-full'>
          
          {
            userData?.map((item) => 

          (

          <div  className='bg-white w-full  rounded-xl shadow-lg flex flex-col  max-w-4xl mx-auto my-8 py-6'>

            <div className="bg-white w-full  px-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 border-l-4 border-indigo-500">
            
             {/* --- Section 1: Personal Info --- */}
             <div className="flex-1 min-w-[200px] border-b pb-2 md:border-b-0 md:border-r md:pr-4 md:pb-0 border-gray-100">
                <h3 className="text-lg font-bold text-indigo-600 mb-2">Personal Details</h3>
                <CardDetail label="Name" value={item.user_name} />
                <CardDetail label="Phone" value={item.user_number} />
                <CardDetail label="Aadhaar" value={item.adhaar} />
             </div>

             {/* --- Section 2: Location --- */}
             <div className="flex-1 min-w-[150px] border-b pb-2 md:border-b-0 md:border-r md:pr-4 md:pb-0 border-gray-100">
                <h3 className="text-lg font-bold text-indigo-600 mb-2">Location</h3>
                <CardDetail label="City" value={item.city} />
                <CardDetail label="Address" value={item.address} />
             </div>

             {/* --- Section 3: Attendance/Support --- */}
             <div className="flex-1 min-w-[150px] border-b pb-2 md:border-b-0 md:border-r md:pr-4 md:pb-0 border-gray-100">
                <h3 className="text-lg font-bold text-indigo-600 mb-2">Attendance</h3>
                <CardDetail label="Attending As" value={item.attend_someone} />
                <CardDetail label="Total People" value={item.how_many_people} />
                <CardDetail label="Support Needed" value={item.support} />
             </div>

            </div>

            <div className='flex items-center justify-between px-5 pt-4'>
              <h3 className='font-bold'>Total Amount: <span>{item.totalAmt}</span></h3>
              <h3 className='font-bold'>Donate Amount: <span>{item.donateAmt}</span></h3>
            </div>
          </div>
          )



            ) 
          }


        {  
        //  <div className="bg-white w-full  rounded-xl shadow-lg p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 border-l-4 border-indigo-500 max-w-4xl mx-auto my-8">
            
        //     {/* --- Section 1: Personal Info --- */}
        //     <div className="flex-1 min-w-[200px] border-b pb-2 md:border-b-0 md:border-r md:pr-4 md:pb-0 border-gray-100">
        //         <h3 className="text-lg font-bold text-indigo-600 mb-2">Personal Details</h3>
        //         <CardDetail label="Name" value="Mohsin" />
        //         <CardDetail label="Phone" value="6388505748" />
        //         <CardDetail label="Aadhaar" value="898918928912" />
        //     </div>

        //     {/* --- Section 2: Location --- */}
        //     <div className="flex-1 min-w-[150px] border-b pb-2 md:border-b-0 md:border-r md:pr-4 md:pb-0 border-gray-100">
        //         <h3 className="text-lg font-bold text-indigo-600 mb-2">Location</h3>
        //         <CardDetail label="City" value="Kanpur" />
        //         <CardDetail label="Address" value="chamanaganj" />
        //     </div>

        //     {/* --- Section 3: Attendance/Support --- */}
        //     <div className="flex-1 min-w-[150px] border-b pb-2 md:border-b-0 md:border-r md:pr-4 md:pb-0 border-gray-100">
        //         <h3 className="text-lg font-bold text-indigo-600 mb-2">Attendance</h3>
        //         <CardDetail label="Attending As" value="1" />
        //         <CardDetail label="Total People" value="2" />
        //         <CardDetail label="Support Needed" value="yes" />
        //     </div>

        //       </div>
}
        </div>



       

  





      </div>




    </div>
  )
}

export default Dashboard