'use client'

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import axios from 'axios';

const blockRequestSchema = z.object({
  date: z.date(),
  blocktype: z.string().min(1, 'Block Type is required'),
  worktype: z.string().nullable(),
  section: z.string().nullable(),
  station: z.string().nullable(),
  line: z.string().min(1, 'Line is required'),
  demandfrom: z.date(),
  demandto: z.date(),
  ohed: z.string().min(1, 'OHE Disconnection is required'),
  ohedr: z.string().optional(),
  sntd: z.string().min(1, 'S&T Disconnection is required'),
  sntdr: z.string().optional(),
  remark: z.string().optional()
});

const BlockRequestContainer = ({ machinesData, sectionData, stationsData, slotData }) => {
  const [filteredStations, setFilteredStations] = useState([]);
  const [insertionStatus, SetInsertionStatus] = useState("Not submitted");
  const [corridorTimings, setCorridorTimings] = useState([]);

  const formik = useFormik({
    initialValues: {
      date: dayjs().toDate(),
      blocktype: '',
      worktype: null,
      section: null,
      station: null,
      line: '',
      demandfrom: dayjs().toDate(),
      demandto: dayjs().toDate(),
      ohed: 'NO',
      ohedr: '',
      sntd: 'NO',
      sntdr: '',
      remark: ''
    },
    validationSchema: zodResolver(blockRequestSchema),
    onSubmit: async (values) => {
      const formattedData = {
        ...values,
        date: dayjs(values.date).format('YYYY-MM-DD'),
        demandfrom: dayjs(values.demandfrom).format('HH:mm:ss'),
        demandto: dayjs(values.demandto).format('HH:mm:ss')
      };
      try {
        const res = await axios.post(process.env.REACT_APP_API_URI + "/createBlockRequest", formattedData);
        if (res.data.success) {
          SetInsertionStatus(res.data.msg);
        } else {
          SetInsertionStatus(res.data);
        }
      } catch (error) {
        SetInsertionStatus("Error in client side posting: " + error);
      }
    }
  });

  useEffect(() => {
    if (formik.values.section) {
      const newFilteredStations = stationsData.filter(station => station.Section_ID === formik.values.section);
      setFilteredStations(newFilteredStations);
    } else {
      setFilteredStations([]);
    }
  }, [formik.values.section]);

  useEffect(() => {
    if (formik.values.date && formik.values.section != null && formik.values.station != null) {
      const dayofweek = dayjs(formik.values.date).day();
      axios.get(process.env.REACT_APP_API_URI + `/corridormatrix?day=${dayofweek}&section=${formik.values.section}&station=${formik.values.station}`)
        .then((res) => {
          setCorridorTimings(res.data);
        });
    }
  }, [formik.values.date, formik.values.section, formik.values.station]);

  const mapTimeSlots = () => {
    return corridorTimings.map(slotId => {
      const slot = slotData.find(s => s.Timeslot_ID === slotId);
      return slot ? slot.Timing : null;
    }).filter(Boolean);
  };

  const availableTimings = mapTimeSlots();

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Block Request</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              {/* <div className="mb-4">
                <DatePicker
                  label="Block Date"
                  value={dayjs(formik.values.date)}
                  onChange={(newValue) => formik.setFieldValue('date', newValue.toDate())}
                  disablePast
                  renderInput={(params) => <input {...params.inputProps} className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />}
                />
                {formik.touched.date && formik.errors.date && <p className="mt-2 text-sm text-red-600">{formik.errors.date}</p>}
              </div> */}
              <div className="mb-4">
                <label htmlFor="blocktype" className="sr-only">Block Type</label>
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
              <div className="mb-4">
                <label htmlFor="worktype" className="sr-only">Work Type</label>
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
              <div className="mb-4">
                <label htmlFor="section" className="sr-only">Section</label>
                <select
                  id="section"
                  name="section"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formik.values.section}
                  onChange={(e) => {
                    formik.handleChange(e);
                    const selectedSectionId = e.target.value;
                    const selectedSection = sectionData.find(section => section.Section_ID === selectedSectionId);
                    formik.setFieldValue('line', selectedSection ? selectedSection.Line : '');
                  }}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Section</option>
                  {sectionData.map((section) => (
                    <option key={section.Section_ID} value={section.Section_ID}>{section.Section}</option>
                  ))}
                </select>
                {formik.touched.section && formik.errors.section && <p className="mt-2 text-sm text-red-600">{formik.errors.section}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="station" className="sr-only">Station Between</label>
                <select
                  id="station"
                  name="station"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formik.values.station}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Station</option>
                  {filteredStations.map((station) => (
                    <option key={station.Station_ID} value={station.Station_ID}>{station.Station}</option>
                  ))}
                </select>
                {formik.touched.station && formik.errors.station && <p className="mt-2 text-sm text-red-600">{formik.errors.station}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="line" className="sr-only">Line</label>
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
              <div className="mb-4">
                <label htmlFor="demandfrom" className="sr-only">Demand From</label>
                <select
                  id="demandfrom"
                  name="demandfrom"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formik.values.demandfrom.toISOString()}
                  onChange={(e) => formik.setFieldValue('demandfrom', dayjs(e.target.value, 'HH:mm').toDate())}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Demand From</option>
                  {availableTimings.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {formik.touched.demandfrom && formik.errors.demandfrom && <p className="mt-2 text-sm text-red-600">{formik.errors.demandfrom}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="demandto" className="sr-only">Demand To</label>
                <select
                  id="demandto"
                  name="demandto"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={formik.values.demandto.toISOString()}
                  onChange={(e) => formik.setFieldValue('demandto', dayjs(e.target.value, 'HH:mm').toDate())}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Demand To</option>
                  {availableTimings.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {formik.touched.demandto && formik.errors.demandto && <p className="mt-2 text-sm text-red-600">{formik.errors.demandto}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="ohed" className="sr-only">OHE Disconnection</label>
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
              <div className="mb-4">
                <label htmlFor="ohedr" className="sr-only">OHE Disconnection Remark</label>
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
              <div className="mb-4">
                <label htmlFor="sntd" className="sr-only">S&T Disconnection</label>
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
              <div className="mb-4">
                <label htmlFor="sntdr" className="sr-only">S&T Disconnection Remark</label>
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
              <div className="mb-4">
                <label htmlFor="remark" className="sr-only">Remark</label>
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
            <div className="flex justify-between">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => formik.resetForm()}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset
              </button>
            </div>
            <p className="text-center mt-4">{insertionStatus}</p>
          </form>
        </div>
      </div>
  );
};

export default BlockRequestContainer;
