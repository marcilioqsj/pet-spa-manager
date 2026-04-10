import { useState, useRef } from "react";
import { Plus, Search, Phone, MapPin, PawPrint, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { tutores as initialTutores, tags as globalTags, tagCores, type Tutor, type Pet, type Tag } from "@/data/mockData";
import { toast } from "sonner";

const porteBadge = {
  Pequeno: 'bg-info/10 text-info border-info/20',
  Médio: 'bg-warning/10 text-warning border-warning/20',
  Grande: 'bg-primary/10 text-primary border-primary/20',
};

function TagInput({ selectedTags, onTagsChange, allTags, onCreateTag }: {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  allTags: Tag[];
  onCreateTag: (tag: Tag) => void;
}) {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = allTags.filter(t =>
    t.nome.toLowerCase().includes(input.toLowerCase()) && !selectedTags.includes(t.id)
  );

  const handleSelect = (tagId: string) => {
    onTagsChange([...selectedTags, tagId]);
    setInput('');
    setShowDropdown(false);
  };

  const handleRemove = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const handleCreateNew = (cor: string) => {
    const newTag: Tag = { id: `tag${Date.now()}`, nome: input.trim(), cor };
    onCreateTag(newTag);
    onTagsChange([...selectedTags, newTag.id]);
    setInput('');
    setShowColorPicker(false);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Tags</Label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {selectedTags.map(tId => {
          const tag = allTags.find(t => t.id === tId);
          if (!tag) return null;
          return (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white cursor-pointer hover:opacity-80"
              style={{ backgroundColor: tag.cor }}
              onClick={() => handleRemove(tag.id)}
            >
              {tag.nome}
              <X className="h-3 w-3" />
            </span>
          );
        })}
      </div>
      <div className="relative">
        <Input
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); setShowDropdown(true); setShowColorPicker(false); }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Buscar ou criar tag..."
          className="text-sm"
        />
        {showDropdown && (input || filtered.length > 0) && (
          <div className="absolute z-50 top-full mt-1 w-full bg-popover border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filtered.map(tag => (
              <button
                key={tag.id}
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors text-left"
                onClick={() => handleSelect(tag.id)}
              >
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: tag.cor }} />
                {tag.nome}
              </button>
            ))}
            {input.trim() && !allTags.some(t => t.nome.toLowerCase() === input.trim().toLowerCase()) && (
              <>
                {!showColorPicker ? (
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-sm text-primary font-medium hover:bg-muted/50 transition-colors text-left"
                    onClick={() => setShowColorPicker(true)}
                  >
                    + Criar "{input.trim()}"
                  </button>
                ) : (
                  <div className="px-3 py-2 space-y-1.5">
                    <p className="text-xs text-muted-foreground">Escolha a cor:</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {tagCores.map(cor => (
                        <button
                          key={cor}
                          type="button"
                          className="h-6 w-6 rounded-full border-2 border-transparent hover:border-foreground/30 transition-colors"
                          style={{ backgroundColor: cor }}
                          onClick={() => handleCreateNew(cor)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PetsTutores() {
  const [tutores, setTutores] = useState<Tutor[]>(initialTutores);
  const [allTags, setAllTags] = useState<Tag[]>(globalTags);
  const [busca, setBusca] = useState('');
  const [tutorDialogOpen, setTutorDialogOpen] = useState(false);
  const [petDialogOpen, setPetDialogOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [expandedTutor, setExpandedTutor] = useState<string | null>(null);
  const [newPetTags, setNewPetTags] = useState<string[]>([]);

  const filtered = tutores.filter(t =>
    t.nome.toLowerCase().includes(busca.toLowerCase()) ||
    t.pets.some(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
  );

  const handleCreateTutor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const novo: Tutor = {
      id: `t${Date.now()}`,
      nome: form.get('nome') as string,
      telefone: form.get('telefone') as string,
      endereco: form.get('endereco') as string,
      pets: [],
    };
    setTutores(prev => [novo, ...prev]);
    setTutorDialogOpen(false);
    toast.success('Tutor cadastrado com sucesso!');
  };

  const handleCreatePet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTutorId) return;
    const form = new FormData(e.currentTarget);
    const novo: Pet = {
      id: `p${Date.now()}`,
      nome: form.get('nome') as string,
      raca: form.get('raca') as string,
      porte: form.get('porte') as Pet['porte'],
      idade: form.get('idade') as string,
      observacoes: form.get('observacoes') as string,
      tutorId: selectedTutorId,
      tags: newPetTags,
    };
    setTutores(prev => prev.map(t => t.id === selectedTutorId ? { ...t, pets: [...t.pets, novo] } : t));
    setPetDialogOpen(false);
    setNewPetTags([]);
    toast.success('Pet cadastrado com sucesso!');
  };

  const handleAddTag = (tag: Tag) => {
    setAllTags(prev => [...prev, tag]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pets & Tutores</h1>
          <p className="text-muted-foreground text-sm mt-1">Cadastro de tutores e seus pets</p>
        </div>
        <Dialog open={tutorDialogOpen} onOpenChange={setTutorDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Tutor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Tutor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTutor} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input name="nome" required placeholder="Nome completo" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input name="telefone" required placeholder="(00) 00000-0000" />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input name="endereco" required placeholder="Rua, número - Cidade" />
              </div>
              <Button type="submit" className="w-full">Cadastrar Tutor</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar tutor ou pet..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-9" />
      </div>

      <Dialog open={petDialogOpen} onOpenChange={(open) => { setPetDialogOpen(open); if (!open) setNewPetTags([]); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Pet</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePet} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input name="nome" required placeholder="Nome do pet" />
            </div>
            <div className="space-y-2">
              <Label>Raça</Label>
              <Input name="raca" required placeholder="Raça" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Porte</Label>
                <select name="porte" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Idade</Label>
                <Input name="idade" required placeholder="Ex: 3 anos" />
              </div>
            </div>
            <TagInput
              selectedTags={newPetTags}
              onTagsChange={setNewPetTags}
              allTags={allTags}
              onCreateTag={handleAddTag}
            />
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea name="observacoes" placeholder="Alergias, temperamento, etc." />
            </div>
            <Button type="submit" className="w-full">Cadastrar Pet</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {filtered.map(tutor => (
          <Card key={tutor.id} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-0">
              <div
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedTutor(expandedTutor === tutor.id ? null : tutor.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <span className="text-lg font-bold text-primary">{tutor.nome.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{tutor.nome}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{tutor.telefone}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{tutor.endereco}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    <PawPrint className="h-3 w-3 mr-1" />
                    {tutor.pets.length} {tutor.pets.length === 1 ? 'pet' : 'pets'}
                  </Badge>
                </div>
              </div>

              {expandedTutor === tutor.id && (
                <div className="border-t bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-muted-foreground">Pets</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-xs"
                      onClick={() => { setSelectedTutorId(tutor.id); setPetDialogOpen(true); }}
                    >
                      <Plus className="h-3 w-3" /> Adicionar Pet
                    </Button>
                  </div>
                  {tutor.pets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum pet cadastrado</p>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {tutor.pets.map(pet => {
                        const petTagObjs = pet.tags.map(tId => allTags.find(t => t.id === tId)).filter(Boolean);
                        return (
                          <div key={pet.id} className="rounded-xl bg-card p-3 border shadow-sm">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-sm">{pet.nome}</p>
                                <p className="text-xs text-muted-foreground">{pet.raca} · {pet.idade}</p>
                              </div>
                              <Badge variant="outline" className={`text-xs ${porteBadge[pet.porte]}`}>
                                {pet.porte}
                              </Badge>
                            </div>
                            {petTagObjs.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {petTagObjs.map(tag => tag && (
                                  <span
                                    key={tag.id}
                                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                                    style={{ backgroundColor: tag.cor }}
                                  >
                                    {tag.nome}
                                  </span>
                                ))}
                              </div>
                            )}
                            {pet.observacoes && (
                              <p className="text-xs text-muted-foreground/70 mt-2">{pet.observacoes}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
