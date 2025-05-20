
import React, { useState } from "react";
import { OptionsProvider } from "@/contexts/OptionsContext";
import { OptionsLayout } from "@/components/options/OptionsLayout";

const Options: React.FC = () => {
  return (
    <OptionsProvider>
      <OptionsLayout />
    </OptionsProvider>
  );
};

export default Options;
