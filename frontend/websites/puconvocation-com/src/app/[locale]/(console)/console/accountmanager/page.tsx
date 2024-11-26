/*
 * Copyright (C) PU Convocation Management System Authors
 *
 * This software is owned by PU Convocation Management System Authors.
 * No part of the software is allowed to be copied or distributed
 * in any form. Any attempt to do so will be considered a violation
 * of copyright law.
 *
 * This software is protected by copyright law and international
 * treaties. Unauthorized copying or distribution of this software
 * is a violation of these laws and could result in severe penalties.
 */
"use client";

import { SquaresPlusIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  FilePicker,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
} from "@components/ui";
import { AuthController } from "@controllers/index";
import { useQuery } from "@tanstack/react-query";
import { StatusCode } from "@enums/StatusCode";
import { Fragment, useState } from "react";
import { DynamicIcon, SpaceShip } from "@components/graphics";
import {
  Account,
  AccountInvitation,
  UpdateAccountIAMPoliciesRequest,
} from "@dto/index";
import { useToast } from "@hooks/useToast";
import { Field, FieldArray, Form, Formik } from "formik";
import csvParser, { ParseResult } from "papaparse";

const authController = new AuthController();

export default function AccountManager() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [assignedIAMPolicies, setAssignedIAMPolicies] =
    useState<UpdateAccountIAMPoliciesRequest | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const { toast } = useToast();

  const {
    data: accounts,
    isLoading,
    isError,
    refetch: refetchAccounts,
  } = useQuery({
    queryKey: ["allAccounts"],
    queryFn: async () => {
      const response = await authController.getAllAccounts();
      if (response.statusCode === StatusCode.SUCCESS) {
        return response.payload;
      }
      return [];
    },
  });

  const { data: policies } = useQuery({
    queryKey: ["allPolicies"],
    queryFn: async () => {
      const response = await authController.getAllIAMPolicies();
      if (response.statusCode === StatusCode.SUCCESS) {
        return response.payload;
      }
      return [];
    },
  });

  return (
    <Fragment>
      <Sheet open={showSheet} onOpenChange={(open) => setShowSheet(open)}>
        {selectedAccount === null || assignedIAMPolicies === null ? (
          <Fragment />
        ) : (
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Account Settings</SheetTitle>
              <SheetDescription asChild={true}>
                <div className={"space-y-4"}>
                  <div
                    className={
                      "flex w-full flex-col items-center space-y-3 pt-5"
                    }
                  >
                    <Avatar className={`size-20`}>
                      <AvatarImage src={selectedAccount.avatarURL} />
                      <AvatarFallback className={"text-xl"}>
                        {selectedAccount.displayName.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className={"text-lg font-bold text-black"}>
                      {selectedAccount.designation.length !== 0
                        ? selectedAccount.designation.concat(" ")
                        : ""}
                      {selectedAccount.displayName}
                    </h4>
                    <span
                      className={
                        "rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600"
                      }
                    >
                      {selectedAccount.username}
                    </span>
                  </div>
                  <div className={"space-y-4"}>
                    <div
                      className={
                        "flex items-center justify-between rounded-xl border px-2 py-3"
                      }
                    >
                      <h6>Suspend</h6>
                      <Checkbox
                        className={"size-5"}
                        checked={selectedAccount.suspended}
                        onCheckedChange={(checked: boolean) => {
                          setSelectedAccount((prevState) => {
                            if (prevState === null) return null;
                            return {
                              ...prevState,
                              suspended: checked,
                            };
                          });
                        }}
                      />
                    </div>
                    {policies !== undefined ? (
                      <div
                        className={
                          "flex flex-col items-start space-y-5 rounded-xl border px-2 py-3"
                        }
                      >
                        <h6 className={"text-lg font-medium"}>Permissions</h6>
                        {policies.map((policy) => {
                          return (
                            <div
                              key={policy.role}
                              className={
                                "flex w-full items-center justify-between"
                              }
                            >
                              <div
                                className={"flex flex-1 flex-col items-start"}
                              >
                                <p className={"font-mono text-black"}>
                                  {policy.role}
                                </p>
                                <span className={"text-xs"}>
                                  {policy.description}
                                </span>
                              </div>
                              <Checkbox
                                className={"size-5"}
                                checked={selectedAccount.iamRoles.includes(
                                  policy.role,
                                )}
                                onCheckedChange={(checked: boolean) => {
                                  setSelectedAccount((prevState) => {
                                    if (prevState === null) return null;
                                    return {
                                      ...prevState,
                                      iamRoles: checked
                                        ? [...prevState.iamRoles, policy.role]
                                        : prevState.iamRoles.filter(
                                            (p) => p !== policy.role,
                                          ),
                                    };
                                  });
                                  const changedPolicyIndex =
                                    assignedIAMPolicies?.iamOperations.indexOf(
                                      assignedIAMPolicies?.iamOperations.filter(
                                        (p) => p.id === policy.role,
                                      )[0],
                                    );
                                  const newPolicies = [
                                    ...assignedIAMPolicies?.iamOperations,
                                  ];
                                  if (changedPolicyIndex === -1) {
                                    newPolicies.push({
                                      id: policy.role,
                                      operation: checked ? "ADD" : "REMOVE",
                                    });
                                  } else {
                                    newPolicies[changedPolicyIndex].operation =
                                      checked ? "ADD" : "REMOVE";
                                  }
                                  setAssignedIAMPolicies((prevState) => {
                                    if (prevState === null) return null;
                                    return {
                                      ...prevState,
                                      iamOperations: [...newPolicies],
                                    };
                                  });
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <Fragment />
                    )}
                    <SheetClose asChild={true}>
                      <Button
                        className={"w-full"}
                        onClick={async () => {
                          const policyUpdateResponse =
                            await authController.updateAccountIAMPolicies(
                              assignedIAMPolicies,
                            );

                          const suspensionResponse =
                            await authController.suspendAccount(
                              selectedAccount.uuid,
                              selectedAccount.suspended,
                            );
                          if (
                            policyUpdateResponse.statusCode ===
                            StatusCode.FAILURE
                          ) {
                            toast({
                              title: "Update Failed",
                              description: policyUpdateResponse.error,
                              duration: 5000,
                            });
                          } else if (
                            suspensionResponse.statusCode === StatusCode.FAILURE
                          ) {
                            toast({
                              title: "Suspension Failed",
                              description: suspensionResponse.error,
                              duration: 5000,
                            });
                          } else {
                            await refetchAccounts();
                          }
                        }}
                      >
                        Save
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        )}
      </Sheet>
      <div className="flex min-h-screen flex-col space-y-10 p-4 md:p-10">
        <div className="space-y-3">
          <h1 className="flex items-center text-2xl font-bold">
            <SquaresPlusIcon className="mr-2 h-6 w-6 text-red-600" /> Account
            Manager
          </h1>
          <p className="text-xs text-gray-600">
            View and manage the list of accounts for the convocation.
          </p>
        </div>

        {/* Add New Account */}
        <div className="rounded-3xl border-none bg-card text-card-foreground shadow-none">
          <div className="flex flex-col space-y-1.5 p-4 md:p-6">
            <div className="font-semibold leading-none tracking-tight">
              Add New Account
            </div>
          </div>
          <div className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="flex flex-col space-y-2">
              <Formik
                initialValues={{
                  invitations: [] as Array<AccountInvitation>,
                }}
                onSubmit={async ({ invitations }) => {
                  const response =
                    await authController.sendAccountInvitations(invitations);
                  if (response.statusCode === StatusCode.FAILURE) {
                    toast({
                      title: "Invitations Failed",
                      description: response.error,
                      duration: 5000,
                    });
                  } else {
                    toast({
                      title: "Invitations Sent",
                      description: `Successfully sent ${invitations.length} invitation(s).`,
                      duration: 5000,
                    });
                  }
                }}
              >
                {({ values }) => (
                  <div className={"space-y-5"}>
                    <Form>
                      <FieldArray name={"invitations"}>
                        {(arrayHelpers) => (
                          <div className={"space-y-3"}>
                            {values.invitations.map(
                              (invitation: AccountInvitation, index) => {
                                return (
                                  <div
                                    key={index}
                                    className={"rounded-xl border px-2 py-3"}
                                  >
                                    <Field name={`invitations[${index}].email`}>
                                      {({ field }: { field: any }) => (
                                        <Input
                                          {...field}
                                          placeholder={"Email..."}
                                          type={"email"}
                                          className={"w-full"}
                                        />
                                      )}
                                    </Field>
                                    {policies && (
                                      <div
                                        className={
                                          "grid w-full grid-cols-1 gap-7 px-2 py-4 md:grid-cols-2"
                                        }
                                      >
                                        {policies.map((policy) => {
                                          return (
                                            <div
                                              key={policy.role}
                                              className={
                                                "flex items-center justify-between"
                                              }
                                            >
                                              <div>
                                                <h6>{policy.role}</h6>
                                                <p
                                                  className={
                                                    "text-xs text-gray-500"
                                                  }
                                                >
                                                  {policy.description}
                                                </p>
                                              </div>
                                              <Checkbox
                                                checked={invitation.iamRoles.includes(
                                                  policy.role,
                                                )}
                                                onCheckedChange={(
                                                  checked: boolean,
                                                ) => {
                                                  if (checked) {
                                                    arrayHelpers.replace(
                                                      index,
                                                      {
                                                        ...invitation,
                                                        iamRoles: [
                                                          ...invitation.iamRoles,
                                                          policy.role,
                                                        ],
                                                      },
                                                    );
                                                  } else {
                                                    const updates = {
                                                      ...invitation,
                                                    };
                                                    updates.iamRoles =
                                                      updates.iamRoles.filter(
                                                        (p) =>
                                                          p !== policy.role,
                                                      );
                                                    arrayHelpers.replace(
                                                      index,
                                                      updates,
                                                    );
                                                  }
                                                }}
                                              />
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              },
                            )}
                            <div
                              className={
                                "relative cursor-pointer rounded-xl border border-dashed border-red-600 py-7"
                              }
                            >
                              <div
                                className={
                                  "absolute right-0 top-0 h-full w-full cursor-pointer rounded-xl bg-red-50"
                                }
                              >
                                <div
                                  className={
                                    "flex h-full cursor-pointer flex-col items-center justify-center space-y-3"
                                  }
                                >
                                  <div
                                    className={"flex space-x-3 text-red-600"}
                                  >
                                    <DynamicIcon icon={"ArrowUpTrayIcon"} />
                                    <h6 className={"font-medium"}>
                                      Upload Account List
                                    </h6>
                                  </div>
                                  <p className={"text-xs text-gray-500"}>
                                    Drag or Click here to upload CSV File
                                  </p>
                                </div>
                              </div>
                              <FilePicker
                                allowedFileExtensions={".csv"}
                                onFilePicked={async (file) => {
                                  if (file !== null) {
                                    csvParser.parse(file as any, {
                                      skipEmptyLines: true,
                                      complete(
                                        results: ParseResult<
                                          Record<string, string>
                                        >,
                                      ) {
                                        for (
                                          let i = 1;
                                          i < results.data.length;
                                          i++
                                        ) {
                                          arrayHelpers.push({
                                            email: results.data[i][0],
                                            iamRoles: results.data[i][1]
                                              .split(",")
                                              .map((r) => r.trim()),
                                          });
                                        }
                                      },
                                    });
                                  }
                                }}
                              />
                            </div>
                            <div
                              className={"flex w-full justify-end space-x-4"}
                            >
                              <Button
                                variant={"secondary"}
                                disabled={
                                  values.invitations.length > 0 &&
                                  values.invitations[
                                    values.invitations.length - 1
                                  ].email === ""
                                }
                                type={"button"}
                                onClick={() => {
                                  arrayHelpers.push({
                                    email: "",
                                    iamRoles: [],
                                  });
                                }}
                              >
                                Add
                              </Button>
                              <Button
                                type={"submit"}
                                disabled={
                                  values.invitations.length === 0 ||
                                  values.invitations.filter(
                                    (i) => i.email === "",
                                  ).length !== 0
                                }
                              >
                                Send Invitations
                              </Button>
                            </div>
                          </div>
                        )}
                      </FieldArray>
                    </Form>
                  </div>
                )}
              </Formik>
            </div>
          </div>
        </div>

        {/* Account List */}
        <Card>
          <CardHeader>
            <CardTitle>Account List</CardTitle>
            <CardDescription>
              Manage existing accounts and their permissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Fragment>
                <Skeleton className={"h-10 w-full"}></Skeleton>
                <Skeleton className={"h-10 w-full"}></Skeleton>
                <Skeleton className={"h-10 w-full"}></Skeleton>
                <Skeleton className={"h-10 w-full"}></Skeleton>
              </Fragment>
            ) : isError || accounts === undefined ? (
              <div
                className={"flex w-full flex-col items-center justify-center"}
              >
                <SpaceShip />
                <h4 className={"text-xl font-bold text-red-600"}>Ohhh!</h4>
                <h5 className={"text-lg font-medium"}>An Error Occurred.</h5>
              </div>
            ) : (
              <div className={"space-y-3"}>
                {accounts.map((account) => {
                  return (
                    <div
                      key={account.uuid}
                      className={
                        "flex items-center justify-between rounded-xl border px-2 py-3"
                      }
                    >
                      <div className={"flex items-center space-x-3"}>
                        <Avatar
                          className={`${account.username === "mihirpaldhikar" || account.username === "suhanishah" ? "border-2 border-red-600" : ""}`}
                        >
                          <AvatarImage src={account.avatarURL} />
                          <AvatarFallback className={"text-xl"}>
                            {account.displayName.substring(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h6 className={"font-medium"}>
                            {account.designation.length !== 0
                              ? account.designation.concat(" ")
                              : ""}{" "}
                            {account.displayName}
                          </h6>
                          <p className={"text-xs text-gray-600"}>
                            {account.email}
                          </p>
                        </div>
                      </div>
                      {account.username !== "mihirpaldhikar" &&
                      account.username !== "suhanishah" ? (
                        <Button
                          size={"icon"}
                          onClick={() => {
                            setShowSheet(true);
                            setSelectedAccount(account);
                            setAssignedIAMPolicies({
                              uuid: account.uuid,
                              iamOperations: account.iamRoles.map((r) => {
                                return {
                                  id: r,
                                  operation: "NO_CHANGE",
                                };
                              }),
                            });
                          }}
                        >
                          <DynamicIcon icon={"PencilIcon"} />
                        </Button>
                      ) : (
                        <Fragment />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
}
