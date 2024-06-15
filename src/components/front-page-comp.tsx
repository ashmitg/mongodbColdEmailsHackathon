"use client"

import { useState } from "react";
import { GetResults, VectorizeDatabase } from "@/actions/lang/action";
import { CarouselSpacing } from './CarouselEmail'
import { SpreadSheet } from './FileUpload'


export function FrontPageComp() {
  const [selectedOption, setSelectedOption] = useState('');

  const [csvdata, setCsvData] = useState(null)

  const [formData, setFormData] = useState({
    emailType: '',
    userContent: '',
  });
  const [response, setResponse] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'emailType') {
      setSelectedOption(value);
    }
  };

  const [result, setResult] = useState(null);
  console.log(result, "results dataaa")

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(csvdata);
    console.log(formData, "form data", formData?.userContent);

    try {
        // Create an array of promises for each item in csvdata
        const results = await Promise.all(csvdata.map(async (data) => {
            const result = await GetResults(
                `Generate a short simplistic cold email to ${data.companyname} for a potential Full-Stack Internship for me (Ashmit), my skillset is ${formData?.userContent}`, 
                "You are a simple cold email personal assistant writing emails for internships", 
                "Companies", 
                data.link
            );
            return { data, result };
        }));
        console.log(results, "results from email data");
        
        setResult(results);
    } catch (error) {
        console.error('Error generating emails:', error);
    }
};

  return (
    <div className="w-screen mx-auto p-6 sm:p-8">
      <div className="space-y-6">
        <div className=" space-y-2 ">
          <h1 className="text-3xl font-bold text-center">Cold Email Generator</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Enter a company website URL and well generate a personalized cold email for you.
          </p>
          
          <SpreadSheet setCsvData={setCsvData} />

        </div>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailType">
                Select Email Type
              </label>
              <div className="relative">
                <select
                  id="emailType"
                  name="emailType"
                  value={selectedOption}
                  onChange={handleChange}
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="" disabled>Select an option</option>
                  <option value="Job Email">Job Email</option>
                  <option value="SWE Internship Email">Internship Email</option>
                  <option value="Business Proposal">Business Proposal</option>
                  <option value="Quick Chat">Quick Chat</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailContent">
                User Information
              </label>
              <textarea
                id="emailContent"
                name="emailContent"
                value={formData.emailContent}
                onChange={handleChange}
                rows={4}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Enter your info here..."
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </form>
          <CarouselSpacing result={result}/>

        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Your Personalized Cold Email</h2>
            <p className="text-gray-500 dark:text-gray-400">
              This is a sample of the email that will be generated for you.
            </p>
          </div>
          <div className="space-y-4">

            <p className="font-medium">
              {response}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
