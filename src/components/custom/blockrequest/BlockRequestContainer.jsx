'use client'

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import axios from 'axios';
import moment from "moment";
import Spinner from '../Spinner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BlockRequestContainer = ({ machinesData, sectionData, stationsData, slotData }) => {
  const [filteredStations, setFilteredStations] = useState(stationsData);
  const [message, setMessage] = useState("");
  const [corridorTimings, setCorridorTimings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonValue, setJsonvalue] = useState("");

  
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      date: dayjs().format('YYYY-MM-DD'),
      blocktype: '',
      dept: "",
      section: null,
      blocksectionyard: "",
      line: '',
      demandfrom: dayjs().format('HH:mm'),
      demandto: dayjs().format('HH:mm'),
      ohed: 'NO',
      ohedr: '',
      sntd: 'NO',
      sntdr: '',
      remark: ''
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      const formattedData = {
        ...values,
        section: values.section ? parseInt(values.section) : null,
        blocksectionyard: values.blocksectionyard,
        date: moment(values.date).format('MM/DD/YYYY'),
        demandfrom: moment(values.demandfrom, 'HH:mm').format('HH:mm:ss'),
        demandto: moment(values.demandto, 'HH:mm').format('HH:mm:ss')
      };
      console.log(formattedData);

      try {
        const res = await axios.post("http://127.0.0.1:5000/add_request", formattedData);
        if (res.data.success) {
          setMessage(res.data.msg);
          // toggleModal()
          // router.push('/request-view');
        } else {
          setMessage(res.data);
        }
        setJsonvalue(JSON.stringify(res.data, null, 2));        toggleModal()

      } catch (error) {
        setMessage("Error in client side posting: " + error);
      } finally {
        setIsLoading(false);
        formik.resetForm();
      }
    }
  });

  const mapTimeSlots = () => {
    return corridorTimings.map(slotId => {
      const slot = slotData.find(s => s.Timeslot_ID === slotId);
      return slot ? `${slot.Timeslot_ID}-${slot.Timing}` : null;
    }).filter(Boolean);
  };

  const availableTimings = mapTimeSlots();

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const stationPairs = [
    "AJJ-AJJN",
    "MLPM-AJJN",
    "AJJN-TRT",
    "TRT-POI",
    "POI-VKZ",
    "VKZ-NG",
    "NG-EKM",
    "EKM-VGA",
    "VGA-PUT",
    "PUT-TDK",
    "TDK-PUDI",
    "PUDI-RU"
  ];

  return (
    <div className="min-h-screen bg-secondary rounded-xl flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
       <div>
      

      {/* Main modal */}
      {showModal && (
        
        <div
          id="default-modal"
          tabindex="-1"
          aria-hidden="true"
          className=" fixed bg-black top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%)] max-h-full overflow-y-auto overflow-x-hidden"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">Your Request & Allocated Request</h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={toggleModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="p-4 md:p-5 space-y-4">
                <div className="text-base  text-gray-500">
                  {jsonValue}
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex justify-between items-center w-full p-4 md:p-5 border-t border-gray-200 rounded-b">
                <Link
                  href="/schedule-manager"

                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Request Chart
                </Link>
                <Link
                  href="/optimised-table"

                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Optimized Chart
                </Link>
              </div>
            </div>
          </div>
        </div>

      )}
    </div>



      <div className="w-4/5 space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Block Request</h2>
        </div>
        <form className="mt-8 space-y-6 w-full" onSubmit={formik.handleSubmit}>
          <div className="w-full grid grid-cols-2 gap-2">
            <div className="mb-4 col-span-1">
              <label htmlFor="date" className="text-sm font-medium text-text-color">Block Date <strong className='text-destructive'>*</strong></label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.date && formik.errors.date && <p className="mt-2 text-sm text-red-600">{formik.errors.date}</p>}
            </div>
            <div className="mb-4 col-span-1">
              <label htmlFor="blocktype" className="text-sm font-medium text-text-color">Block Type 
                {/* <strong className='text-destructive'>*</strong> */}
              </label>
              <select
                id="blocktype"
                name="blocktype"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formik.values.blocktype}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select Block Type</option>
                <option value="NON-Rolling Block">NON-Rolling Block</option>
                <option value="Rolling Block">Rolling Block</option>
              </select>
              {formik.touched.blocktype && formik.errors.blocktype && <p className="mt-2 text-sm text-red-600">{formik.errors.blocktype}</p>}
            </div>
            <div className="mb-4 col-span-1">
              <label htmlFor="dept" className="text-sm font-medium text-text-color">Work Type <strong className='text-destructive'>*</strong></label>
              <select
                id="dept"
                name="dept"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formik.values.dept}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              >
                <option value="">Select Work Type</option>
                <option value="ENGG">ENGG</option>
                <option value="SIG">SIG</option>
                <option value="TRD">TRD</option>
              </select>
              {formik.touched.dept && formik.errors.dept && <p className="mt-2 text-sm text-red-600">{formik.errors.dept}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-text-color">Section 
                {/* <strong className='text-destructive'>*</strong> */}
                </label>
               <select
                  value={formik.values.section}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="section"
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="" label="Select section" />
                  {sectionData.map((section) => (
                    <option key={section.Section_ID} value={section.Section_ID}>{section.Section}</option>
                  ))}
                </select>
                {formik.touched.section && formik.errors.section && (
                  <div className="text-red-500 text-sm">{formik.errors.section}</div>
                )}
              </div>
            <div className="mb-4 col-span-1">
              <label htmlFor="blocksectionyard" className="text-sm font-medium text-text-color">Station Between <strong className='text-destructive'>*</strong></label>
              <select
                id="blocksectionyard"
                name="blocksectionyard"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formik.values.blocksectionyard}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              >
                <option value="" label="Select station pair" />
                {stationPairs.map((pair, index) => (
                  <option key={index} value={pair}>{pair}</option>
                ))}
              </select>
              {formik.touched.blocksectionyard && formik.errors.blocksectionyard && <p className="mt-2 text-sm text-red-600">{formik.errors.blocksectionyard}</p>}
            </div>
            <div className="mb-4 col-span-1">
              <label htmlFor="line" className="text-sm font-medium text-text-color">Line <strong className='text-destructive'>*</strong></label>
              <select
                id="line"
                name="line"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formik.values.line}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                >
                <option value="">Select Line</option>
                <option value="UP">UP</option>
                <option value="DN">DN</option>
              </select>
              {formik.touched.line && formik.errors.line && <p className="mt-2 text-sm text-red-600">{formik.errors.line}</p>}
            </div>
            <div className="mb-4 col-span-1">
              <label htmlFor="demandfrom" className="text-sm font-medium text-text-color">Demand From <strong className='text-destructive'>*</strong></label>
              <input
                id="demandfrom"
                name="demandfrom"
                type="time"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formik.values.demandfrom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.demandfrom && formik.errors.demandfrom && <p className="mt-2 text-sm text-red-600">{formik.errors.demandfrom}</p>}
            </div>
            <div className="mb-4 col-span-1">
              <label htmlFor="demandto" className="text-sm font-medium text-text-color">Demand To <strong className='text-destructive'>*</strong></label>
              <input
                id="demandto"
                name="demandto"
                type="time"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formik.values.demandto}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.demandto && formik.errors.demandto && <p className="mt-2 text-sm text-red-600">{formik.errors.demandto}</p>}
            </div>
            <div className="mb-4 col-span-1">
              <label htmlFor="ohed" className="text-sm font-medium text-text-color">OHE Disconnection</label>
              <select
                id="ohed"
                name="ohed"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formik.values.ohed}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="NO">NO</option>
                <option value="YES">YES</option>
              </select>
              {formik.touched.ohed && formik.errors.ohed && <p className="mt-2 text-sm text-red-600">{formik.errors.ohed}</p>}
            </div>
            <div className="mb-4 col-span-1">
              <label htmlFor="ohedr" className="text-sm font-medium text-text-color">OHE Disconnection Remark</label>
              <input
                id="ohedr"
                name="ohedr"
                type="text"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="OHE Disconnection Remark"
                value={formik.values.ohedr}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.ohedr && formik.errors.ohedr && <p className="mt-2 text-sm text-red-600">{formik.errors.ohedr}</p>}
            </div>
            <div className="mb-4 col-span-1">
              <label htmlFor="sntd" className="text-sm font-medium text-text-color">S&T Disconnection</label>
              <select
                id="sntd"
                name="sntd"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formik.values.sntd}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="NO">NO</option>
                <option value="YES">YES</option>
              </select>
              {formik.touched.sntd && formik.errors.sntd && <p className="mt-2 text-sm text-red-600">{formik.errors.sntd}</p>}
            </div>
            <div className="mb-4 col-span-1">
              <label htmlFor="sntdr" className="text-sm font-medium text-text-color">SNTD Remarks</label>
              <input
                id="sntdr"
                name="sntdr"
                type="text"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="S&T Disconnection Remark"
                value={formik.values.sntdr}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.sntdr && formik.errors.sntdr && <p className="mt-2 text-sm text-red-600">{formik.errors.sntdr}</p>}
            </div>
            <div className="mb-4 col-span-2">
              <label htmlFor="remark" className="text-sm font-medium text-text-color">Remarks</label>
              <textarea
                id="remark"
                name="remark"
                rows="3"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formik.values.remark}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.remark && formik.errors.remark && <p className="mt-2 text-sm text-red-600">{formik.errors.remark}</p>}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? <Spinner /> : 'Submit'}
            </button>
          </div>
          {message && (
            <div className="text-center text-sm mt-4">
              {/* <p className={message.startsWith("Error") ? "text-red-600" : "text-green-600"}>{message}</p> */}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BlockRequestContainer;
