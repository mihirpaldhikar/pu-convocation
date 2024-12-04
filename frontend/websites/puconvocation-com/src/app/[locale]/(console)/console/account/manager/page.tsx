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

import { UsersIcon } from "@heroicons/react/24/solid";
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
import { SpaceShip } from "@components/graphics";
import {
  Account,
  AccountInvitation,
  UpdateAccountIAMPoliciesRequest,
} from "@dto/index";
import { useToast } from "@hooks/useToast";
import { Field, FieldArray, Form, Formik } from "formik";
import csvParser, { ParseResult } from "papaparse";
import { ArrowUpTrayIcon, PencilIcon } from "@heroicons/react/24/outline";
import { isAuthorized } from "@lib/iam_utils";
import IAMPolicies from "@configs/IAMPolicies";
import { useAuth } from "@hooks/index";

const authController = new AuthController();

function validateEmail(value: string) {
  let error;
  if (!value) {
    error = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Invalid email address";
  }
  return error;
}

export default function AccountManager() {
  const { account: currentAccount } = useAuth();
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

  const { data: iamPolicies } = useQuery({
    queryKey: ["allPolicies"],
    queryFn: async () => {
      const response = await authController.getIAMPolicies();
      if (response.statusCode === StatusCode.SUCCESS) {
        return response.payload;
      }
      return [];
    },
  });

  if (currentAccount === null) return <Fragment />;

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
                    {iamPolicies !== undefined ? (
                      <div
                        className={
                          "flex flex-col items-start space-y-5 rounded-xl border px-2 py-3"
                        }
                      >
                        <h6 className={"text-lg font-medium"}>Permissions</h6>
                        {iamPolicies.map((iamPolicy) => {
                          return (
                            <div
                              key={iamPolicy.policy}
                              className={
                                "flex w-full items-center justify-between"
                              }
                            >
                              <div
                                className={"flex flex-1 flex-col items-start"}
                              >
                                <p className={"font-mono text-black"}>
                                  {iamPolicy.policy}
                                </p>
                                <span className={"text-xs"}>
                                  {iamPolicy.description}
                                </span>
                              </div>
                              <Checkbox
                                className={"size-5"}
                                checked={selectedAccount.assignedIAMPolicies.includes(
                                  iamPolicy.policy,
                                )}
                                onCheckedChange={(checked: boolean) => {
                                  setSelectedAccount((prevState) => {
                                    if (prevState === null) return null;
                                    return {
                                      ...prevState,
                                      assignedIAMPolicies: checked
                                        ? [
                                            ...prevState.assignedIAMPolicies,
                                            iamPolicy.policy,
                                          ]
                                        : prevState.assignedIAMPolicies.filter(
                                            (p) => p !== iamPolicy.policy,
                                          ),
                                    };
                                  });
                                  const changedPolicyIndex =
                                    assignedIAMPolicies?.iamPolicyOperations.indexOf(
                                      assignedIAMPolicies?.iamPolicyOperations.filter(
                                        (p) => p.policy === iamPolicy.policy,
                                      )[0],
                                    );
                                  const newPolicies = [
                                    ...assignedIAMPolicies?.iamPolicyOperations,
                                  ];
                                  if (changedPolicyIndex === -1) {
                                    newPolicies.push({
                                      policy: iamPolicy.policy,
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
                                      iamPolicyOperations: [...newPolicies],
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
            <UsersIcon className="mr-2 h-6 w-6 text-red-600" /> Account Manager
          </h1>
          <p className="text-xs text-gray-600">
            View and manage the list of accounts for the convocation.
          </p>
        </div>

        {/* Add New Account */}
        {isAuthorized(
          IAMPolicies.WRITE_ACCOUNTS,
          currentAccount.assignedIAMPolicies,
        ) ? (
          <Card>
            <CardHeader>
              <CardTitle>Send Invitations</CardTitle>
              <CardDescription>
                Add email addresses and select what operations should be allowed
                for the user.
              </CardDescription>
            </CardHeader>
            <CardContent className={"px-3 lg:px-6"}>
              <div className="flex flex-col space-y-2">
                <Formik
                  initialValues={{
                    invitations: [] as Array<AccountInvitation>,
                  }}
                  validate={(values) => {
                    const errors: any = {};
                    if (values.invitations.length === 0) {
                      errors.minimumLength =
                        "Please enter at least one account invitation.";
                    }

                    return errors;
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
                  {({ values, errors, touched }) => (
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
                                      <Field
                                        name={`invitations[${index}].email`}
                                        validate={validateEmail}
                                      >
                                        {({ field }: { field: any }) => (
                                          <Fragment>
                                            <Input
                                              {...field}
                                              placeholder={"Email..."}
                                              type={"email"}
                                              className={"w-full"}
                                            />
                                            {touched.invitations &&
                                              touched.invitations[index] &&
                                              errors.invitations &&
                                              errors.invitations[index] && (
                                                <p
                                                  className={
                                                    "py-1 text-xs text-red-800"
                                                  }
                                                >
                                                  {
                                                    (
                                                      errors.invitations[
                                                        index
                                                      ] as any
                                                    ).email
                                                  }
                                                </p>
                                              )}
                                          </Fragment>
                                        )}
                                      </Field>
                                      {iamPolicies && (
                                        <div
                                          className={
                                            "grid w-full grid-cols-1 gap-7 px-2 py-4 md:grid-cols-2"
                                          }
                                        >
                                          {iamPolicies.map((iamPolicy) => {
                                            return (
                                              <div
                                                key={iamPolicy.policy}
                                                className={
                                                  "flex items-center justify-between"
                                                }
                                              >
                                                <div>
                                                  <h6 className={"font-mono"}>
                                                    {iamPolicy.policy}
                                                  </h6>
                                                  <p
                                                    className={
                                                      "text-xs text-gray-500"
                                                    }
                                                  >
                                                    {iamPolicy.description}
                                                  </p>
                                                </div>
                                                <Checkbox
                                                  checked={invitation.assignedIAMPolicies.includes(
                                                    iamPolicy.policy,
                                                  )}
                                                  onCheckedChange={(
                                                    checked: boolean,
                                                  ) => {
                                                    if (checked) {
                                                      arrayHelpers.replace(
                                                        index,
                                                        {
                                                          ...invitation,
                                                          assignedIAMPolicies: [
                                                            ...invitation.assignedIAMPolicies,
                                                            iamPolicy.policy,
                                                          ],
                                                        },
                                                      );
                                                    } else {
                                                      const updates = {
                                                        ...invitation,
                                                      };
                                                      updates.assignedIAMPolicies =
                                                        updates.assignedIAMPolicies.filter(
                                                          (p) =>
                                                            p !==
                                                            iamPolicy.policy,
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
                                      <div
                                        className={
                                          "flex items-center justify-end"
                                        }
                                      >
                                        <Button
                                          type={"button"}
                                          variant={"outline"}
                                          onClick={() => {
                                            arrayHelpers.remove(index);
                                          }}
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                              <div
                                className={
                                  "relative my-3 cursor-pointer rounded-xl border border-dashed border-neutral-600 py-7"
                                }
                              >
                                <div
                                  className={
                                    "absolute right-0 top-0 h-full w-full cursor-pointer rounded-xl bg-neutral-50"
                                  }
                                >
                                  <div
                                    className={
                                      "flex h-full cursor-pointer flex-col items-center justify-center space-y-3"
                                    }
                                  >
                                    <div
                                      className={
                                        "flex space-x-3 text-neutral-700"
                                      }
                                    >
                                      <ArrowUpTrayIcon className={"size-5"} />
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
                                              assignedIAMPolicies: results.data[
                                                i
                                              ][1]
                                                .split(",")
                                                .map((r) => r.trim())
                                                .filter((r) =>
                                                  iamPolicies
                                                    ?.map((p) => p.policy)
                                                    .includes(r),
                                                ),
                                            });
                                          }
                                        },
                                      });
                                    }
                                  }}
                                />
                              </div>
                              <div
                                className={
                                  "flex w-full justify-end space-x-4 pt-6"
                                }
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
                                      assignedIAMPolicies: [],
                                    });
                                  }}
                                >
                                  Add
                                </Button>
                                <Button
                                  className={
                                    "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                                  }
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
            </CardContent>
          </Card>
        ) : (
          <Fragment />
        )}

        {/* Account List */}
        {isAuthorized(
          IAMPolicies.READ_ACCOUNTS,
          currentAccount.assignedIAMPolicies,
        ) ? (
          <Card>
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>
                Manage existing accounts and their permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-3 lg:px-6">
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
                        {isAuthorized(
                          IAMPolicies.WRITE_ACCOUNTS,
                          currentAccount.assignedIAMPolicies,
                        ) &&
                        account.username !== "mihirpaldhikar" &&
                        account.username !== "suhanishah" ? (
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            onClick={() => {
                              setShowSheet(true);
                              setSelectedAccount(account);
                              setAssignedIAMPolicies({
                                uuid: account.uuid,
                                iamPolicyOperations:
                                  account.assignedIAMPolicies.map((r) => {
                                    return {
                                      policy: r,
                                      operation: "NO_CHANGE",
                                    };
                                  }),
                              });
                            }}
                          >
                            <PencilIcon className={"size-5"} />
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
        ) : (
          <Fragment />
        )}
      </div>
    </Fragment>
  );
}
