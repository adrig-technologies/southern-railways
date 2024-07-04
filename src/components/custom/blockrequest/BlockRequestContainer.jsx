'use client'

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import axios from 'axios';
import moment from "moment";
import Spinner from '../Spinner';

// const blockRequestSchema = z.object({
//   date: z.date(),
//   blocktype: z.string().min(1, 'Block Type is required'),
//   worktype: z.string().nullable(),
//   section: z.string().nullable(),
//   station: z.string().nullable(),
//   line: z.string().min(1, 'Line is required'),
//   demandfrom: z.date(),
//   demandto: z.date(),
//   ohed: z.string().min(1, 'OHE Disconnection is required'),
//   ohedr: z.string().optional(),
//   sntd: z.string().min(1, 'S&T Disconnection is required'),
//   sntdr: z.string().optional(),
//   remark: z.string().optional()
// });

const BlockRequestContainer = ({ machinesData, sectionData, stationsData, slotData }) => {
  const [filteredStations, setFilteredStations] = useState(stationsData);
  const [message, setMessage] = useState("");
  const [corridorTimings, setCorridorTimings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      date: dayjs().format('YYYY-MM-DD'),
      blocktype: '',
      worktype: null,
      section: null,
      station: null,
      line: '',
      demandfrom: dayjs().format('HH:mm'),
      demandto: dayjs().format('HH:mm'),
      ohed: 'NO',
      ohedr: '',
      sntd: 'NO',
      sntdr: '',
      remark: ''
    },
    // validationSchema: zodResolver(blockRequestSchema),
    onSubmit: async (values) => {
      setIsLoading(true)
      const formattedData = {
        ...values,
        worktype: parseInt(formik.values.worktype),
        section: parseInt(formik.values.section),
        station: parseInt(formik.values.station),
        date: moment(values.date).format('YYYY-MM-DD'),
          demandfrom: moment(values.demandfrom, 'HH:mm').format('HH:mm:ss'),
          demandto: moment(values.demandto, 'HH:mm').format('HH:mm:ss')
      };

      try {
        const res = await axios.post("http://localhost:4000/createBlockRequest", formattedData);
        if (res.data.success) {
          setMessage(res.data.msg);
        } else {
          setMessage(res.data);
        }
      } catch (error) {
        setMessage("Error in client side posting: " + error);
      } finally {
        setIsLoading(false);
        formik.resetForm()
      }
    }
  });

//   // useEffect(() => {
//   //   if (formik.values.section) {
//   //     const newFilteredStations = stationsData.filter(station => station.Section_ID === formik.values.section);
//   //     setFilteredStations(newFilteredStations);
//   //   } else {
//   //     setFilteredStations([]);
//   //   }
//   // }, [formik.values.section, stationsData]);

  const mapTimeSlots = () => {
    return corridorTimings.map(slotId => {
      const slot = slotData.find(s => s.Timeslot_ID === slotId);
      return slot ? `${slot.Timeslot_ID}-${slot.Timing}` : null; // Ensure unique keys
    }).filter(Boolean);
  };

  const availableTimings = mapTimeSlots();

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-4/5 space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Block Request</h2>
          </div>
          <form className="mt-8 space-y-6 w-full" onSubmit={formik.handleSubmit}>
            <div className="w-full grid grid-cols-2 gap-2">
              <div className="mb-4 col-span-1">
                <label htmlFor="date" className="text-md ml-2 text-slate-500">Block Date <strong className='text-destructive'>*</strong></label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.date && formik.errors.date && <p className="mt-2 text-sm text-red-600">{formik.errors.date}</p>}
              </div>
              <div className="mb-4 col-span-1">
                <label htmlFor="blocktype" className="text-md ml-2 text-slate-500">Block Type <strong className='text-destructive'>*</strong></label>
                <select
                  id="blocktype"
                  name="blocktype"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                <label htmlFor="worktype" className="text-md ml-2 text-slate-500">Work Type <strong className='text-destructive'>*</strong></label>
                <select
                  id="worktype"
                  name="worktype"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formik.values.worktype}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Work Type</option>
                  {machinesData.map((machine) => (
                    <option key={machine.Machine_ID} value={machine.Machine_ID}>{machine.Machine}</option>
                  ))}
                </select>
                {formik.touched.worktype && formik.errors.worktype && <p className="mt-2 text-sm text-red-600">{formik.errors.worktype}</p>}
              </div>
              <div>
              <label className="block mb-1">Section <strong className='text-destructive'>*</strong></label>
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
              <div>
                <label className="block mb-1">Station Between <strong className='text-destructive'>*</strong></label>
                <select
                  value={formik.values.station}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="station"
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="" label="Select station" />
                  {stationsData.map((station) => (
                    <option key={station.Station_ID} value={station.Station_ID}>{station.Station}</option>
                  ))}
                </select>
                {formik.touched.station && formik.errors.station && (
                  <div className="text-red-500 text-sm">{formik.errors.station}</div>
                )}
              </div>
              <div className="mb-4 col-span-1">
                <label htmlFor="line" className="text-md ml-2 text-slate-500">Line <strong className='text-destructive'>*</strong></label>
                <select
                  id="line"
                  name="line"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                <label htmlFor="demandfrom" className="text-md ml-2 text-slate-500">Demand From <strong className='text-destructive'>*</strong></label>
                <input
                  id="demandfrom"
                  name="demandfrom"
                  type="time"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formik.values.demandfrom}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.demandfrom && formik.errors.demandfrom && <p className="mt-2 text-sm text-red-600">{formik.errors.demandfrom}</p>}
              </div>
              <div className="mb-4 col-span-1">
                <label htmlFor="demandto" className="text-md ml-2 text-slate-500">Demand To <strong className='text-destructive'>*</strong></label>
                <input
                  id="demandto"
                  name="demandto"
                  type="time"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formik.values.demandto}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.demandto && formik.errors.demandto && <p className="mt-2 text-sm text-red-600">{formik.errors.demandto}</p>}
              </div>
              <div className="mb-4 col-span-1">
                <label htmlFor="ohed" className="text-md ml-2 text-slate-500"> OHE Disconnection<strong className='text-destructive'>*</strong></label>
                <select
                  id="ohed"
                  name="ohed"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                <label htmlFor="ohedr" className="text-md ml-2 text-slate-500"> OHE Disconnection Remark<strong className='text-destructive'>*</strong></label>
                <input
                  id="ohedr"
                  name="ohedr"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="OHE Disconnection Remark"
                  value={formik.values.ohedr}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.ohedr && formik.errors.ohedr && <p className="mt-2 text-sm text-red-600">{formik.errors.ohedr}</p>}
              </div>
              <div className="mb-4 col-span-1">
                <label htmlFor="sntd" className="text-md ml-2 text-slate-500"> S&T Disconnection<strong className='text-destructive'>*</strong></label>
                <select
                  id="sntd"
                  name="sntd"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                <label htmlFor="sntdr" className="text-md ml-2 text-slate-500"> S&T Disconnection Remark<strong className='text-destructive'>*</strong></label>
                <input
                  id="sntdr"
                  name="sntdr"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="S&T Disconnection Remark"
                  value={formik.values.sntdr}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.sntdr && formik.errors.sntdr && <p className="mt-2 text-sm text-red-600">{formik.errors.sntdr}</p>}
              </div>
              <div className="mb-4 col-span-2">
                <label htmlFor="remark" className="text-md ml-2 text-slate-500"> Remark<strong className='text-destructive'>*</strong></label>
                <textarea
                  id="remark"
                  name="remark"
                  rows={4}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Remark"
                  value={formik.values.remark}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.remark && formik.errors.remark && <p className="mt-2 text-sm text-red-600">{formik.errors.remark}</p>}
              </div>
            </div>
            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={() => formik.resetForm()}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset
              </button>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
               {isLoading ? <Spinner /> : <span>Submit</span>}
              </button>
            </div>
            {message.length > 0 && (<p className="text-center mt-4">{insertionStatus}</p>)}
          </form>
        </div>
      </div>
  );
};


export default BlockRequestContainer;