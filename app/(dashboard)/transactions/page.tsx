"use client";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { 
 Card,
 CardContent,
 CardHeader,
 CardTitle,
 } from "@/components/ui/card";

import { transactions as transactionSchema } from "@/db/schema";
import {columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";


//for CSV file
enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};



const TransactionPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log({results});
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  //using hook created in use-get-transaction
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];

  const isDisabled = 
    transactionsQuery.isLoading ||
    deleteTransactions.isPending;

  const onSubmitImport = async (
    values: typeof transactionSchema.$inferInsert[],
  ) => {
    const accountId = await confirm();

    if(!accountId){
      return toast.error("Please select an account to continue.");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  //loading state (animation) 
  if(transactionsQuery.isLoading){
    return(
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none frop-shadow-sm">
        <CardHeader>
          <Skeleton className="h-8 w-48"/>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full flex items-center justify-center">
            <Loader2 className="size-6 text-slate-300 animate-spin" />
          </div>
        </CardContent> 
        </Card>
      </div>
    )
  }

  if(variant === VARIANTS.IMPORT){
    return (
      <>
        <AccountDialog/>
        <ImportCard
          data = {importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 ">
      <Card className="border-none frop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
          <Button 
            onClick={newTransaction.onOpen} 
            size="sm"
            className="w-full lg:w-auto"
          >
            <Plus className="size-4 mr-2"/>
            Add New
          </Button>
          <UploadButton
            onUpload= {onUpload}
          />
          </div>
        </CardHeader>
        <CardContent>
        <DataTable 
          filterKey="payee"
          columns={columns} 
          data={transactions}  
          onDelete={(row)=>{
            const ids = row.map((r)=>r.original.id);
            deleteTransactions.mutate({ids});
          }}
          disabled={isDisabled}
        />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionPage;