import React, { useState } from 'react';
import {
  Plus, Edit2, Trash2, Users, Building2, X, Bed, UserCheck, ClipboardList,
  User, Stethoscope, Heart, Phone, Mail, ArrowLeft, Eye, Calendar, Activity
} from 'lucide-react';

// --- MOCK STAFF DATA ---
const mockStaff = {
    doctors: [
        { id: 'd101', name: 'Dr. Jane Doe', deptId: 1, email: 'jane.doe@hospital.com', phone: '+91-98765-43210' },
        { id: 'd102', name: 'Dr. Alan Turing', deptId: 1, email: 'alan.turing@hospital.com', phone: '+91-98765-43211' },
        { id: 'd103', name: 'Dr. Grace Hopper', deptId: 2, email: 'grace.hopper@hospital.com', phone: '+91-98765-43212' },
        { id: 'd104', name: 'Dr. Mike Ross', deptId: null, email: 'mike.ross@hospital.com', phone: '+91-98765-43213' },
        { id: 'd105', name: 'Dr. Stephen Strange', deptId: null, email: 'stephen.strange@hospital.com', phone: '+91-98765-43214' },
    ],
    nurses: [
        { id: 'n201', name: 'Nurse Clara Barton', deptId: 1, email: 'clara.barton@hospital.com', phone: '+91-98765-43215' },
        { id: 'n202', name: 'Nurse Florence Nightingale', deptId: 3, email: 'florence@hospital.com', phone: '+91-98765-43216' },
        { id: 'n203', name: 'Nurse Amy Fowler', deptId: 2, email: 'amy.fowler@hospital.com', phone: '+91-98765-43217' },
        { id: 'n204', name: 'Nurse Penny Hofstadter', deptId: 2, email: 'penny@hospital.com', phone: '+91-98765-43218' },
        { id: 'n205', name: 'Nurse Sheldon Cooper', deptId: null, email: 'sheldon@hospital.com', phone: '+91-98765-43219' },
    ],
};

const mockPatients = {
    1: [
        { id: 'p101', name: 'John Smith', age: 45, condition: 'Heart Disease', admissionDate: '2024-01-15', status: 'Stable' },
        { id: 'p102', name: 'Mary Johnson', age: 62, condition: 'Arrhythmia', admissionDate: '2024-01-18', status: 'Critical' },
        { id: 'p103', name: 'Robert Brown', age: 58, condition: 'Heart Failure', admissionDate: '2024-01-20', status: 'Stable' },
    ],
    2: [
        { id: 'p201', name: 'Sarah Wilson', age: 35, condition: 'Migraine', admissionDate: '2024-01-16', status: 'Improving' },
        { id: 'p202', name: 'David Lee', age: 70, condition: 'Stroke', admissionDate: '2024-01-19', status: 'Critical' },
    ],
    3: [
        { id: 'p301', name: 'Michael Chen', age: 28, condition: 'Fractured Arm', admissionDate: '2024-01-17', status: 'Stable' },
        { id: 'p302', name: 'Emma Davis', age: 45, condition: 'Knee Replacement', admissionDate: '2024-01-14', status: 'Recovering' },
        { id: 'p303', name: 'James Wilson', age: 60, condition: 'Hip Fracture', admissionDate: '2024-01-21', status: 'Critical' },
    ],
    4: [
        { id: 'p401', name: 'Sophia Martinez', age: 8, condition: 'Pneumonia', admissionDate: '2024-01-18', status: 'Improving' },
        { id: 'p402', name: 'Liam Johnson', age: 5, condition: 'Asthma', admissionDate: '2024-01-20', status: 'Stable' },
    ],
    5: [
        { id: 'p501', name: 'Olivia Taylor', age: 32, condition: 'Appendicitis', admissionDate: '2024-01-21', status: 'Critical' },
        { id: 'p502', name: 'William Brown', age: 55, condition: 'Heart Attack', admissionDate: '2024-01-21', status: 'Critical' },
        { id: 'p503', name: 'Ava Garcia', age: 40, condition: 'Severe Burns', admissionDate: '2024-01-19', status: 'Stable' },
        { id: 'p504', name: 'Noah Martinez', age: 25, condition: 'Car Accident', admissionDate: '2024-01-20', status: 'Critical' },
    ]
};

const departmentDetails = {
    1: { email: 'cardiology@hospital.com', hod: 'Dr. Sarah Smith' },
    2: { email: 'neurology@hospital.com', hod: 'Dr. Mike Davis' },
    3: { email: 'orthopedics@hospital.com', hod: 'Dr. John Lee' },
    4: { email: 'pediatrics@hospital.com', hod: 'Dr. Emily Brown' },
    5: { email: 'emergency@hospital.com', hod: 'Dr. Robert Wilson' },
};

const DepartmentManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [staffData, setStaffData] = useState(mockStaff);
    const [staffTypeToAssign, setStaffTypeToAssign] = useState(null);
    const [detailedView, setDetailedView] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '', description: '', headDoctor: '', contactNumber: '',
        totalBeds: 0, totalRooms: 0, nurseCount: 0, doctorCount: 0,
    });

    const [departments, setDepartments] = useState([
        { id: 1, name: 'Cardiology', description: 'Heart and cardiovascular system care, specializing in cardiac catheterization and bypass surgery.', headDoctor: 'Dr. Sarah Smith', contactNumber: '+91-11-12345678', totalBeds: 30, totalRooms: 15, patientCount: 22 },
        { id: 2, name: 'Neurology', description: 'Brain and nervous system disorders, focusing on stroke, epilepsy, and Parkinson\'s.', headDoctor: 'Dr. Mike Davis', contactNumber: '+91-11-12345679', totalBeds: 25, totalRooms: 12, patientCount: 18 },
        { id: 3, name: 'Orthopedics', description: 'Bone, joint, and muscle treatment, including sports injuries and replacements.', headDoctor: 'Dr. John Lee', contactNumber: '+91-11-12345680', totalBeds: 40, totalRooms: 20, patientCount: 35 },
        { id: 4, name: 'Pediatrics', description: 'Comprehensive healthcare for children from infancy through adolescence.', headDoctor: 'Dr. Emily Brown', contactNumber: '+91-11-12345681', totalBeds: 20, totalRooms: 10, patientCount: 18 },
        { id: 5, name: 'Emergency', description: '24/7 critical and acute care medical services for severe illness or injury.', headDoctor: 'Dr. Robert Wilson', contactNumber: '+91-11-12345682', totalBeds: 50, totalRooms: 25, patientCount: 60 },
    ]);

    const showToast = (message) => {
        const toastDiv = document.createElement('div');
        toastDiv.className = 'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 bg-green-500';
        toastDiv.textContent = message;
        document.body.appendChild(toastDiv);
        setTimeout(() => toastDiv.remove(), 3000);
    };

    const getDeptStaffCount = (deptId, type) => {
        const staffList = type === 'doctor' ? staffData.doctors : staffData.nurses;
        return staffList.filter(s => s.deptId === deptId).length;
    };

    const getDeptStaff = (deptId, type) => {
        const staffList = type === 'doctor' ? staffData.doctors : staffData.nurses;
        return staffList.filter(s => s.deptId === deptId);
    };

    const getDeptPatients = (deptId) => {
        return mockPatients[deptId] || [];
    };

    const handleOpenAssignmentModal = (e, department, staffType) => {
        e.stopPropagation();
        setSelectedDepartment(department);
        setStaffTypeToAssign(staffType);
        setShowAssignmentModal(true);
    };

    const handleCloseAssignmentModal = () => {
        setShowAssignmentModal(false);
        setSelectedDepartment(null);
        setStaffTypeToAssign(null);
    };

    const handleAssignStaff = (staffId, staffType, deptId) => {
        setStaffData(prev => {
            const listKey = staffType === 'doctor' ? 'doctors' : 'nurses';
            const updatedList = prev[listKey].map(staff =>
                staff.id === staffId ? { ...staff, deptId: deptId } : staff
            );
            return { ...prev, [listKey]: updatedList };
        });
        showToast(`${staffType === 'doctor' ? 'Doctor' : 'Nurse'} assigned successfully!`);
    };

    const handleUnassignStaff = (staffId, staffType, departmentName) => {
        setStaffData(prev => {
            const listKey = staffType === 'doctor' ? 'doctors' : 'nurses';
            const updatedList = prev[listKey].map(staff =>
                staff.id === staffId ? { ...staff, deptId: null } : staff
            );
            return { ...prev, [listKey]: updatedList };
        });
        showToast(`Staff removed from ${departmentName}.`);
    };

    const handleOpenModal = (department = null) => {
        if (department) {
            setSelectedDepartment(department);
            setFormData({
                name: department.name, 
                description: department.description, 
                headDoctor: department.headDoctor, 
                contactNumber: department.contactNumber,
                totalBeds: department.totalBeds || 0, 
                totalRooms: department.totalRooms || 0,
                nurseCount: getDeptStaffCount(department.id, 'nurse'), 
                doctorCount: getDeptStaffCount(department.id, 'doctor'),
            });
        } else {
            setSelectedDepartment(null);
            setFormData({ 
                name: '', 
                description: '', 
                headDoctor: '', 
                contactNumber: '', 
                totalBeds: 0, 
                totalRooms: 0, 
                nurseCount: 0, 
                doctorCount: 0 
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDepartment(null);
        setFormData({ 
            name: '', 
            description: '', 
            headDoctor: '', 
            contactNumber: '', 
            totalBeds: 0, 
            totalRooms: 0, 
            nurseCount: 0, 
            doctorCount: 0 
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newDeptData = { 
            ...formData, 
            totalBeds: Number(formData.totalBeds), 
            totalRooms: Number(formData.totalRooms),
            patientCount: selectedDepartment ? selectedDepartment.patientCount : 0
        };

        if (selectedDepartment) {
            const updatedDepartments = departments.map((dept) => 
                dept.id === selectedDepartment.id ? { ...dept, ...newDeptData } : dept
            );
            setDepartments(updatedDepartments);
            
            if (detailedView && detailedView.id === selectedDepartment.id) {
                setDetailedView({ ...detailedView, ...newDeptData });
            }
            
            showToast('Department updated successfully!');
        } else {
            const newDepartment = { 
                id: Math.max(...departments.map(d => d.id)) + 1, 
                ...newDeptData, 
                patientCount: 0 
            };
            setDepartments([...departments, newDepartment]);
            showToast('Department created successfully!');
        }
        handleCloseModal();
    };
    
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            setDepartments(departments.filter((dept) => dept.id !== id));
            setStaffData(prev => ({
                doctors: prev.doctors.map(d => d.deptId === id ? { ...d, deptId: null } : d),
                nurses: prev.nurses.map(n => n.deptId === id ? { ...n, deptId: null } : n),
            }));
            
            if (detailedView && detailedView.id === id) {
                setDetailedView(null);
            }
            
            showToast('Department deleted successfully!');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['totalBeds', 'totalRooms'].includes(name)) {
            setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCardClick = (department) => {
        setDetailedView(department);
    };

    const handleBackToList = () => {
        setDetailedView(null);
    };

    const totalDepartments = departments.length;
    const totalDoctors = staffData.doctors.length;
    const totalNurses = staffData.nurses.length;
    const totalBeds = departments.reduce((sum, dept) => sum + dept.totalBeds, 0);
    const totalPatients = departments.reduce((sum, dept) => sum + dept.patientCount, 0);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
                    <p className="text-gray-600 mt-1">Manage hospital departments, resources, and staff assignments</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Department</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-100 font-medium">Total Departments</p>
                            <p className="text-3xl font-bold mt-2">{totalDepartments}</p>
                        </div>
                        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                            <Building2 className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-100 font-medium">Total Doctors</p>
                            <p className="text-3xl font-bold mt-2">{totalDoctors}</p>
                        </div>
                        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                            <Stethoscope className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pink-100 font-medium">Total Nurses</p>
                            <p className="text-3xl font-bold mt-2">{totalNurses}</p>
                        </div>
                        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                            <Heart className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-100 font-medium">Total Beds</p>
                            <p className="text-3xl font-bold mt-2">{totalBeds}</p>
                        </div>
                        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                            <Bed className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-orange-100 font-medium">Total Patients</p>
                            <p className="text-3xl font-bold mt-2">{totalPatients}</p>
                        </div>
                        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {detailedView && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <button 
                        onClick={handleBackToList}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Departments</span>
                    </button>

                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{detailedView.name}</h2>
                                <p className="text-gray-500">Department #{detailedView.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleOpenModal(detailedView)}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Edit2 className="h-4 w-4" />
                                <span>Edit Info</span>
                            </button>
                            <button
                                onClick={() => handleDelete(detailedView.id)}
                                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-700 mb-8 leading-relaxed text-lg">{detailedView.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-100">Total Doctors</p>
                                    <p className="text-2xl font-bold">{getDeptStaffCount(detailedView.id, 'doctor')}</p>
                                </div>
                                <Stethoscope className="h-8 w-8 opacity-90" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-4 rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-pink-100">Total Nurses</p>
                                    <p className="text-2xl font-bold">{getDeptStaffCount(detailedView.id, 'nurse')}</p>
                                </div>
                                <Heart className="h-8 w-8 opacity-90" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-100">Total Staff</p>
                                    <p className="text-2xl font-bold">
                                        {getDeptStaffCount(detailedView.id, 'doctor') + getDeptStaffCount(detailedView.id, 'nurse')}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 opacity-90" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                <Phone className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Phone Number</p>
                                    <p className="font-medium text-gray-900">{detailedView.contactNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                <Mail className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium text-gray-900">{departmentDetails[detailedView.id]?.email || `${detailedView.name.toLowerCase()}@hospital.com`}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                <UserCheck className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Head of Department</p>
                                    <p className="font-medium text-gray-900">{detailedView.headDoctor}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Resources</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
                                    <Bed className="h-6 w-6 mb-2 opacity-90" />
                                    <p className="text-sm text-blue-100">Total Beds</p>
                                    <p className="text-xl font-bold">{detailedView.totalBeds}</p>
                                </div>
                                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-lg shadow-md">
                                    <Building2 className="h-6 w-6 mb-2 opacity-90" />
                                    <p className="text-sm text-indigo-100">Total Rooms</p>
                                    <p className="text-xl font-bold">{detailedView.totalRooms}</p>
                                </div>
                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-md">
                                    <ClipboardList className="h-6 w-6 mb-2 opacity-90" />
                                    <p className="text-sm text-orange-100">Current Patients</p>
                                    <p className="text-xl font-bold">{detailedView.patientCount}</p>
                                </div>
                                <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-4 rounded-lg shadow-md">
                                    <Activity className="h-6 w-6 mb-2 opacity-90" />
                                    <p className="text-sm text-teal-100">Bed Occupancy</p>
                                    <p className="text-xl font-bold">
                                        {Math.round((detailedView.patientCount / detailedView.totalBeds) * 100)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Staff Assignment</h3>
                        
                        <div className="flex space-x-4 mb-6">
                            <button
                                onClick={(e) => handleOpenAssignmentModal(e, detailedView, 'doctor')}
                                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex-1 justify-center"
                            >
                                <Stethoscope className="h-5 w-5" />
                                <span>Assign Doctors</span>
                            </button>
                            <button
                                onClick={(e) => handleOpenAssignmentModal(e, detailedView, 'nurse')}
                                className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-3 rounded-lg hover:bg-pink-700 transition-colors flex-1 justify-center"
                            >
                                <Heart className="h-5 w-5" />
                                <span>Assign Nurses</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-gray-200 rounded-lg p-4 bg-green-50 shadow-sm">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                                    <Stethoscope className="h-4 w-4 text-green-600" />
                                    <span>Assigned Doctors ({getDeptStaffCount(detailedView.id, 'doctor')})</span>
                                </h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {getDeptStaff(detailedView.id, 'doctor').map(doctor => (
                                        <div key={doctor.id} className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-green-100 rounded-full">
                                                    <User className="h-3 w-3 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{doctor.name}</p>
                                                    <p className="text-xs text-gray-600">{doctor.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleUnassignStaff(doctor.id, 'doctor', detailedView.name)}
                                                className="text-red-600 hover:text-red-800 text-sm px-3 py-1 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    {getDeptStaff(detailedView.id, 'doctor').length === 0 && (
                                        <p className="text-gray-500 text-center py-4 bg-white rounded-lg">No doctors assigned</p>
                                    )}
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4 bg-pink-50 shadow-sm">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                                    <Heart className="h-4 w-4 text-pink-600" />
                                    <span>Assigned Nurses ({getDeptStaffCount(detailedView.id, 'nurse')})</span>
                                </h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {getDeptStaff(detailedView.id, 'nurse').map(nurse => (
                                        <div key={nurse.id} className="flex items-center justify-between p-3 border border-pink-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-pink-100 rounded-full">
                                                    <User className="h-3 w-3 text-pink-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{nurse.name}</p>
                                                    <p className="text-xs text-gray-600">{nurse.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleUnassignStaff(nurse.id, 'nurse', detailedView.name)}
                                                className="text-red-600 hover:text-red-800 text-sm px-3 py-1 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    {getDeptStaff(detailedView.id, 'nurse').length === 0 && (
                                        <p className="text-gray-500 text-center py-4 bg-white rounded-lg">No nurses assigned</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Current Patients ({getDeptPatients(detailedView.id).length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getDeptPatients(detailedView.id).map(patient => (
                                <div key={patient.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4 text-gray-600" />
                                            <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            patient.status === 'Critical' ? 'bg-red-100 text-red-800' :
                                            patient.status === 'Stable' ? 'bg-green-100 text-green-800' :
                                            patient.status === 'Improving' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {patient.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Age:</span>
                                            <span className="font-medium">{patient.age} years</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Condition:</span>
                                            <span className="font-medium text-right">{patient.condition}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Admitted:</span>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-3 w-3" />
                                                <span className="font-medium">{patient.admissionDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {getDeptPatients(detailedView.id).length === 0 && (
                            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">No patients currently admitted</p>
                        )}
                    </div>
                </div>
            )}

            {!detailedView && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((department) => {
                        const currentDoctorCount = getDeptStaffCount(department.id, 'doctor');
                        const currentNurseCount = getDeptStaffCount(department.id, 'nurse');

                        return (
                            <div
                                key={department.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Building2 className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{department.name}</h3>
                                            <p className="text-sm text-gray-500">Dept. #{department.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(department); }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Info"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(department.id); }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCardClick(department); }}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{department.description}</p>
                                
                                <div className="grid grid-cols-2 gap-4 pb-4 border-b mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 flex items-center space-x-1"><Stethoscope className="h-3 w-3 text-gray-500" /> <span>Doctors</span></p>
                                        <p className="text-xl font-bold text-gray-900">{currentDoctorCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 flex items-center space-x-1"><Users className="h-3 w-3 text-gray-500" /> <span>Nurses</span></p>
                                        <p className="text-xl font-bold text-gray-900">{currentNurseCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 flex items-center space-x-1"><Bed className="h-3 w-3 text-gray-500" /> <span>Beds</span></p>
                                        <p className="text-lg font-bold text-gray-900">{department.totalBeds}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 flex items-center space-x-1"><ClipboardList className="h-3 w-3 text-gray-500" /> <span>Patients</span></p>
                                        <p className="text-lg font-bold text-gray-900">{department.patientCount}</p>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-600 space-y-1 mb-4">
                                    <div className="flex items-center space-x-1">
                                        <Phone className="h-3 w-3" />
                                        <span>{department.contactNumber}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <UserCheck className="h-3 w-3" />
                                        <span>{department.headDoctor}</span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={() => handleCardClick(department)}
                                        className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>View Details</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <h3 className="text-xl font-bold text-gray-900">{selectedDepartment ? 'Edit Department' : 'Add New Department'}</h3>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="h-5 w-5 text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">General Information</h4>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label><input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Cardiology" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea name="description" required value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Brief description of the department" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Head Doctor</label><input type="text" name="headDoctor" required value={formData.headDoctor} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Dr. John Smith" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label><input type="text" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., +91-11-12345678" /></div>
                            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3 pt-3">Resources</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Total Beds</label><input type="number" name="totalBeds" required min="0" value={formData.totalBeds} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Total Rooms</label><input type="number" name="totalRooms" required min="0" value={formData.totalRooms} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
                            </div>
                            <div className="flex items-center space-x-3 pt-4 border-t border-gray-100 mt-6">
                                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    {selectedDepartment ? 'Update Department' : 'Create Department'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {showAssignmentModal && selectedDepartment && staffTypeToAssign && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <h3 className="text-xl font-bold text-gray-900">
                                Assign {staffTypeToAssign === 'doctor' ? 'Doctor' : 'Nurse'} to {selectedDepartment.name}
                            </h3>
                            <button onClick={handleCloseAssignmentModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold pb-2 border-b border-gray-200 text-gray-900">
                                    Available & Assigned {staffTypeToAssign === 'doctor' ? 'Doctors' : 'Nurses'}
                                    <span className='text-sm font-normal text-gray-500 ml-2'>({getDeptStaffCount(selectedDepartment.id, staffTypeToAssign)} assigned)</span>
                                </h4>
                                
                                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                    {(staffTypeToAssign === 'doctor' ? staffData.doctors : staffData.nurses).map(staff => (
                                        <div 
                                            key={staff.id} 
                                            className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow"
                                        >
                                            <div className='flex items-center space-x-2'>
                                                <User className='h-4 w-4 text-gray-600' />
                                                <div>
                                                    <span className="font-medium text-gray-800">{staff.name}</span>
                                                    <p className="text-xs text-gray-600">{staff.email} • {staff.phone}</p>
                                                </div>
                                            </div>
                                            
                                            {staff.deptId === selectedDepartment.id ? (
                                                <button
                                                    onClick={() => handleUnassignStaff(staff.id, staffTypeToAssign, selectedDepartment.name)}
                                                    className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                                >
                                                    Unassign
                                                </button>
                                            ) : staff.deptId !== null ? (
                                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                                    Assigned to Dept {staff.deptId}
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleAssignStaff(staff.id, staffTypeToAssign, selectedDepartment.id)}
                                                    className={`px-3 py-1 text-xs text-white rounded-md hover:opacity-90 transition-colors ${
                                                        staffTypeToAssign === 'doctor' ? 'bg-green-600' : 'bg-pink-600'
                                                    }`}
                                                >
                                                    Assign
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-4 border-t mt-4 flex justify-end">
                            <button
                                onClick={handleCloseAssignmentModal}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default DepartmentManagement;