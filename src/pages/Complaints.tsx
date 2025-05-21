import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  MessageSquare,
  FileText,
  Edit,
  Trash2,
  ImagePlus,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ComplaintStatus =
  | "Pateiktas"
  | "Gautas"
  | "Peržiūrėtas"
  | "Įvykdytas"
  | "Atmestas";

interface Complaint {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: ComplaintStatus;
  date: string;
}

const mockComplaints: Complaint[] = [
  {
    id: "1",
    subject: "Netinkamas turinys",
    category: "content",
    message: "Radau netinkamą informaciją.",
    status: "Pateiktas",
    date: "2025-04-15",
  },
  {
    id: "2",
    subject: "Techninė problema",
    category: "technical",
    message: "Neveikia žemėlapio funkcija.",
    status: "Įvykdytas",
    date: "2025-04-14",
  },
];

const ComplaintsPage: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("Pateiktas");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newComplaint: Complaint = {
      id: String(Date.now()),
      subject,
      category,
      message,
      status: "Pateiktas",
      date: new Date().toISOString().split("T")[0],
    };

    // Simulate form submission
    setTimeout(() => {
      setComplaints((prev) => [newComplaint, ...prev]);
      setIsLoading(false);
      toast({
        title: "Skundas pateiktas",
        description:
          "Jūsų skundas buvo sėkmingai išsiųstas. Mes jį peržiūrėsime kuo greičiau.",
      });

      // Reset form
      setSubject("");
      setCategory("");
      setMessage("");
      setAttachments([]);
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleOpenStatusDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setIsStatusDialogOpen(true);
  };

  const handleOpenDeleteDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDeleteDialogOpen(true);
  };

  const handleChangeStatus = () => {
    if (selectedComplaint) {
      setComplaints((prevComplaints) =>
        prevComplaints.map((c) =>
          c.id === selectedComplaint.id ? { ...c, status: newStatus } : c
        )
      );
      toast({
        title: "Statusas pakeistas",
        description: `Skundo "${selectedComplaint.subject}" statusas pakeistas į "${newStatus}".`,
      });
      setIsStatusDialogOpen(false);
      setSelectedComplaint(null);
    }
  };

  const handleDeleteComplaint = () => {
    if (selectedComplaint) {
      setComplaints((prevComplaints) =>
        prevComplaints.filter((c) => c.id !== selectedComplaint.id)
      );
      toast({
        title: "Skundas ištrintas",
        description: `Skundas "${selectedComplaint.subject}" buvo sėkmingai pašalintas.`,
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      setSelectedComplaint(null);
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case "Pateiktas":
        return "text-blue-500";
      case "Peržiūrėtas":
        return "text-blue-600";
      case "Įvykdytas":
        return "text-green-600";
      case "Atmestas":
        return "text-red-600";
      default:
        return "";
    }
  };

  const categoryMap: Record<string, string> = {
    technical: "Techninė problema",
    content: "Neteisingas turinys",
    user: "Naudotojo elgesys",
    payment: "Mokėjimo problema",
    other: "Kita",
  };

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pateikti skundą</h1>
          <p className="text-muted-foreground">
            Susidūrėte su problema? Pateikite skundą ir mes jį peržiūrėsime kuo
            greičiau.
          </p>
        </div>

        <Tabs defaultValue="submit" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submit" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Pateikti skundą
            </TabsTrigger>
            <TabsTrigger value="view" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Peržiūrėti skundus
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Skundo forma
                </CardTitle>
                <CardDescription>
                  Užpildykite žemiau esančią formą, kad pateiktumėte skundą.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Tema</Label>
                    <Input
                      id="subject"
                      placeholder="Įveskite skundo temą"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Kategorija</Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pasirinkite kategoriją" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryMap).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Žinutė</Label>
                    <Textarea
                      id="message"
                      placeholder="Aprašykite savo problemą..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Pridėti nuotrauką ar vaizdo įrašą</Label>
                    <div className="flex flex-col gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,video/*"
                        multiple
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={triggerFileInput}
                        className="w-full md:w-auto flex items-center gap-2"
                      >
                        <ImagePlus className="h-4 w-4" />
                        Pridėti nuotrauką ar vaizdo įrašą
                      </Button>

                      {/* Display attached files */}
                      {attachments.length > 0 && (
                        <div className="grid gap-2 mt-2">
                          {attachments.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-secondary/30 p-2 rounded-md"
                            >
                              <span className="text-sm truncate">
                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile(index)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <p>
                      Pateikdami skundą, jūs sutinkate su mūsų privatumo
                      politika ir taisyklėmis. Mes nesidalinsime jūsų asmenine
                      informacija be jūsų sutikimo.
                    </p>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setSubject("");
                    setCategory("");
                    setMessage("");
                  }}
                >
                  Atšaukti
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? "Siunčiama..." : "Pateikti skundą"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="view">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Skundų sąrašas
                </CardTitle>
                <CardDescription>
                  Peržiūrėkite visus pateiktus skundus ir jų būsenas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {complaints.length === 0 ? (
                  <p className="text-muted-foreground text-center">
                    Skundų nėra.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tema</TableHead>
                        <TableHead>Kategorija</TableHead>
                        <TableHead>Būsena</TableHead>
                        <TableHead className="text-right">Veiksmai</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell>{complaint.date}</TableCell>
                          <TableCell>{complaint.subject}</TableCell>
                          <TableCell>
                            {categoryMap[complaint.category] ||
                              complaint.category}
                          </TableCell>
                          <TableCell
                            className={getStatusColor(complaint.status)}
                          >
                            {complaint.status}
                          </TableCell>
                          <TableCell className="text-right space-x-2 whitespace-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenStatusDialog(complaint)}
                            >
                              <Edit className="mr-1 h-3 w-3" /> Keisti statusą
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleOpenDeleteDialog(complaint)}
                            >
                              <Trash2 className="mr-1 h-3 w-3" /> Ištrinti
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {selectedComplaint && (
        <>
          <Dialog
            open={isStatusDialogOpen}
            onOpenChange={setIsStatusDialogOpen}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Keisti skundo statusą</DialogTitle>
                <DialogDescription>
                  Pasirinkite naują statusą skundui "{selectedComplaint.subject}
                  ".
                </DialogDescription>
                <div className="pt-3">
                  <Label
                    htmlFor="complaintMessageFull"
                    className="text-sm font-medium"
                  >
                    Skundo pranešimas:
                  </Label>
                  <div
                    id="complaintMessageFull"
                    className="mt-1 text-sm p-3 bg-muted rounded-md max-h-40 overflow-y-auto border"
                  >
                    {selectedComplaint.message}
                  </div>
                </div>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Statusas
                  </Label>
                  <Select
                    value={newStatus}
                    onValueChange={(value) =>
                      setNewStatus(value as ComplaintStatus)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pasirinkite statusą" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pateiktas">Pateiktas</SelectItem>
                      <SelectItem value="Gautas">Gautas</SelectItem>
                      <SelectItem value="Peržiūrėtas">Peržiūrėtas</SelectItem>
                      <SelectItem value="Įvykdytas">Įvykdytas</SelectItem>
                      <SelectItem value="Atmestas">Atmestas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Atšaukti</Button>
                </DialogClose>
                <Button onClick={handleChangeStatus}>Išsaugoti</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Ar tikrai norite ištrinti skundą?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Šis veiksmas negali būti atšauktas. Skundas "
                  {selectedComplaint.subject}" bus visam laikui pašalintas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Atšaukti</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteComplaint}>
                  Ištrinti
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default ComplaintsPage;
