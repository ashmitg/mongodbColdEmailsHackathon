"use client"
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { useState } from "react";
import { Button } from "./ui/button";
import { VectorizeDatabase } from "@/actions/lang/action";


export function SpreadSheet({setCsvData}) {
  // Define your fields array
  const fields = [
    {
      label: "Company Name",
      key: "companyname",
      alternateMatches: ["company"],
      fieldType: {
        type: "input",
      },
      example: "Acme Corporation",
      validations: [
        {
          rule: "required",
          errorMessage: "Company Name is required",
          level: "error",
        },
      ],
    },
    {
      label: "Person Name",
      key: "personname",
      alternateMatches: ["name"],
      fieldType: {
        type: "input",
      },
      example: "John Doe",
      validations: [
        {
          
          rule: "required",
          errorMessage: "Person Name is required",
          level: "error",
        },
      ],
    },
    {
      label: "Email Address",
      key: "email",
      alternateMatches: ["email address", "email"],
      fieldType: {
        type: "input",
      },
      example: "john.doe@example.com",
      validations: [
        {
          rule: "required",
          errorMessage: "Email Address is required",
          level: "error",
        },
        {
          rule: "regex",
          regex: /^\S+@\S+\.\S+$/,
          errorMessage: "Invalid Email Address",
          level: "error",
        },
      ],
    },
    {
      label: "Link",
      key: "link",
      alternateMatches: ["Link", "Url"],
      fieldType: {
        type: "input",
      },
      example: "example.com",
      validations: [
        {
          rule: "required",
          errorMessage: "Link is required",
          level: "error",
        },
        {
          rule: "regex",
          regex: /^\S+@\S+\.\S+$/,
          errorMessage: "Invalid Link",
          level: "error",
        },
      ],
    },
    // Add more fields as needed
  ];

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false);
  }

  const onSubmit = async (data) => {
    console.log(data, "data")
    setCsvData(data.all);

    const promises = data.all.map(async (item)=> {
      const {link, companyname, personname, email} = item;
      return await VectorizeDatabase(link, companyname, personname, email);
    })



    const results = await Promise.all(promises);

    console.log('All data processed:', results);

  }

  return (
    <div className="flex justify-center">

      <Button onClick={() => setIsOpen(true)}>Register Contacts</Button>

      <ReactSpreadsheetImport isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} fields={fields} />

    </div>

  )
}